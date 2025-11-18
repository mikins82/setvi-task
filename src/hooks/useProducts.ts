import { useInfiniteQuery } from "@tanstack/react-query";
import { fetchProducts } from "../api/products";
import { PAGINATION, QUERY_KEYS } from "../constants";

/**
 * Custom hook for managing infinite product list with React Query
 *
 * @param params - Search and filter parameters
 * @param params.q - Search query string
 * @param params.category - Category filter
 * @returns React Query infinite query result with products
 */
export const useInfiniteProducts = (params: {
  q?: string;
  category?: string;
}) => {
  return useInfiniteQuery({
    queryKey: [QUERY_KEYS.PRODUCTS, { q: params.q, category: params.category }],
    queryFn: ({ pageParam = 0 }) =>
      fetchProducts({
        limit: PAGINATION.ITEMS_PER_PAGE,
        skip: pageParam,
        q: params.q,
        category: params.category,
      }),
    getNextPageParam: (lastPage, allPages) => {
      const loaded = allPages.length * PAGINATION.ITEMS_PER_PAGE;
      if (loaded < lastPage.total) {
        return loaded;
      }
      return undefined;
    },
    initialPageParam: 0, // Using literal 0 instead of constant due to strict type checking
  });
};
