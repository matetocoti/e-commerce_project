import { useProducts } from "./useProducts";

/**
 * @deprecated Use useProducts with search parameter instead
 * Example: useProducts({ page, pageSize, search: query })
 */
export function useProductSearch(query: string, page: number, pageSize: number) {
  return useProducts({ page, pageSize, search: query });
}