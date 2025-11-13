import { useInfiniteQuery } from "@tanstack/react-query";
import { fetchProducts } from "../api/products";

const ITEMS_PER_PAGE = 30;

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
    queryKey: ["products", { q: params.q, category: params.category }],
    queryFn: ({ pageParam = 0 }) =>
      fetchProducts({
        limit: ITEMS_PER_PAGE,
        skip: pageParam,
        q: params.q,
        category: params.category,
      }),
    getNextPageParam: (lastPage, allPages) => {
      const loaded = allPages.length * ITEMS_PER_PAGE;
      if (loaded < lastPage.total) {
        return loaded;
      }
      return undefined;
    },
    initialPageParam: 0,
  });
};

