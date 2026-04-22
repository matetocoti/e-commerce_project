const API_BASE_URL = import.meta.env.VITE_API_URL ?? "http://localhost:5056";

interface ApiFetchOptions extends Omit<RequestInit, "body"> {
  token?: string | null;
  body?: unknown;
}

function getStoredToken(): string | null {
  const storedAuth = localStorage.getItem("auth");

  if (!storedAuth) {
    return null;
  }

  try {
    const parsed = JSON.parse(storedAuth) as { token?: string };
    return parsed.token ?? null;
  } catch {
    return null;
  }
}

export async function apiFetch<T>(endpoint: string,options: ApiFetchOptions = {}): Promise<T> {
  const { token, headers, body, ...rest } = options;

  const authToken = token ?? getStoredToken();

  const response = await fetch(`${API_BASE_URL}${endpoint}`, {
    ...rest,
    headers: {
      "Content-Type": "application/json",
      ...(authToken ? { Authorization: `Bearer ${authToken}` } : {}),
      ...headers,
    },
    body: body === undefined ? undefined : JSON.stringify(body),
  });

  if (!response.ok) {
    let message = "Erro na requisição";

    try {
      const errorData = await response.json();
      message = errorData.message ?? errorData.title ?? message;
    } catch {
      message = response.statusText || message;
    }

    throw new Error(message);
  }

  if (response.status === 204) {
    return {} as T;
  }

  const text = await response.text();

  if (!text) {
    return {} as T;
  }

  return JSON.parse(text) as T;
}