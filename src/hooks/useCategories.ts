import { useQuery } from "@tanstack/react-query";
import { fetchCategories } from "../api/products";

/**
 * Custom hook to fetch product categories
 * Categories are cached indefinitely as they rarely change
 */
export const useCategories = () => {
  return useQuery({
    queryKey: ["categories"],
    queryFn: fetchCategories,
    staleTime: Infinity, // Categories rarely change
  });
};

