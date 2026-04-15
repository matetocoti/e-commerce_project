const dateFormatter = new Intl.DateTimeFormat("pt-BR", {
  day: "2-digit",
  month: "short",
  year: "numeric",
});

export function formatDate(value: string | Date): string {
  return dateFormatter.format(new Date(value));
}