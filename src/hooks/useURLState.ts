import { useSearchParams } from "react-router-dom";

/**
 * Custom hook to manage application state via URL search parameters
 * Provides a single source of truth for query, category, and productId
 */
export const useURLState = () => {
  const [searchParams, setSearchParams] = useSearchParams();

  const query = searchParams.get("q") || "";
  const category = searchParams.get("category") || "";
  const productId = searchParams.get("productId") || "";

  const updateQuery = (q: string) => {
    setSearchParams((params) => {
      if (q) params.set("q", q);
      else params.delete("q");
      // Keep category - allow combining query and category
      return params;
    });
  };

  const updateCategory = (cat: string) => {
    setSearchParams((params) => {
      if (cat) params.set("category", cat);
      else params.delete("category");
      // Keep query - allow combining query and category
      return params;
    });
  };

  const updateProductId = (id: string) => {
    setSearchParams((params) => {
      if (id) params.set("productId", id);
      else params.delete("productId");
      return params;
    });
  };

  return {
    query,
    category,
    productId,
    updateQuery,
    updateCategory,
    updateProductId,
  };
};

