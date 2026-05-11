/**
 * Cache de formatadores para evitar recriação desnecessária.
 */
const formatterCache = new Map<string, Intl.NumberFormat>();

interface FormatPriceOptions {
  locale?: string;
  currency?: string;
  showSymbol?: boolean;
}

/**
 * Retorna um formatador de moeda reutilizável.
 */
function getFormatter(
  locale = "pt-BR",
  currency = "BRL"
): Intl.NumberFormat {
  const key = `${locale}-${currency}`;

  const cachedFormatter = formatterCache.get(key);

  if (cachedFormatter) {
    return cachedFormatter;
  }

  const formatter = new Intl.NumberFormat(locale, {
    style: "currency",
    currency,
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });

  formatterCache.set(key, formatter);

  return formatter;
}

/**
 * Formata um valor monetário.
 *
 * @example
 * formatPrice(1234.56)
 * // "R$ 1.234,56"
 */
export function formatPrice(
  value: number | null | undefined,
  options?: FormatPriceOptions
): string {
  if (
    value === null ||
    value === undefined ||
    Number.isNaN(value) ||
    !Number.isFinite(value)
  ) {
    return "R$ 0,00";
  }

  try {
    const formatter = getFormatter(
      options?.locale,
      options?.currency
    );

    const formattedValue = formatter.format(value);

    if (options?.showSymbol === false) {
      return formattedValue
        .replace(/[^\d.,-]/g, "")
        .trim();
    }

    return formattedValue;
  } catch {
    return "R$ 0,00";
  }
}

/**
 * Calcula e formata um preço com desconto percentual.
 *
 * @example
 * formatPriceWithDiscount(100, 10)
 * // "R$ 90,00"
 */
export function formatPriceWithDiscount(
  price: number,
  discount: number
): string {
  if (
    price <= 0 ||
    discount <= 0 ||
    discount > 100
  ) {
    return formatPrice(price);
  }

  const discountedPrice = price * (1 - discount / 100);

  return formatPrice(discountedPrice);
}

/**
 * Formata um intervalo de preços.
 *
 * @example
 * formatPriceRange(10, 100)
 * // "R$ 10,00 - R$ 100,00"
 */
export function formatPriceRange(
  minPrice: number,
  maxPrice: number
): string {
  return `${formatPrice(minPrice)} - ${formatPrice(maxPrice)}`;
}

/**
 * Converte um valor monetário formatado para número.
 *
 * @example
 * parseCurrencyToNumber("R$ 1.234,56")
 * // 1234.56
 */
export function parseCurrencyToNumber(
  formattedPrice: string
): number {
  try {
    const normalizedValue = formattedPrice
      .replace(/[^\d.,-]/g, "")
      .replaceAll(".", "")
      .replace(",", ".");

    const parsedValue = Number.parseFloat(normalizedValue);

    return Number.isNaN(parsedValue)
      ? 0
      : parsedValue;
  } catch {
    return 0;
  }
}