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

export async function apiFetch<T>(
  endpoint: string,
  options: ApiFetchOptions = {},
): Promise<T> {
  const { token, headers, body, ...rest } = options;

  const authToken = token ?? getStoredToken();
  const fullUrl = `${API_BASE_URL}${endpoint}`;

  console.log("🔗 apiFetch - URL completa:", fullUrl);
  console.log("🔗 apiFetch - Método:", options.method || "GET");
  console.log("🔗 apiFetch - Body:", body);

  const response = await fetch(fullUrl, {
    ...rest,
    headers: {
      "Content-Type": "application/json",
      ...(authToken ? { Authorization: `Bearer ${authToken}` } : {}),
      ...headers,
    },
    body: body === undefined ? undefined : JSON.stringify(body),
  });

  console.log("📡 Response status:", response.status, response.statusText);

  if (!response.ok) {
    let message = `Erro ${response.status}: ${response.statusText || "Erro desconhecido"}`;

    try {
      const errorData = await response.json();
      const errorMessage =
        errorData.message ?? errorData.title ?? errorData.detail;
      if (errorMessage) {
        message = errorMessage;
      }
    } catch {
      // Se não conseguir parsear JSON, usa a mensagem padrão
    }

    console.error(`API Error [${response.status}] ${endpoint}:`, message);
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
