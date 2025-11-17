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
  const page = searchParams.get("page")
    ? parseInt(searchParams.get("page")!, 10)
    : 1;

  const updateQuery = (q: string) => {
    setSearchParams((params) => {
      if (q) params.set("q", q);
      else params.delete("q");
      // Reset to page 1 when search changes
      params.delete("page");
      // Keep category - allow combining query and category
      return params;
    });
  };

  const updateCategory = (cat: string) => {
    setSearchParams((params) => {
      if (cat) params.set("category", cat);
      else params.delete("category");
      // Reset to page 1 when category changes
      params.delete("page");
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

  const updatePage = (pageNum: number) => {
    setSearchParams((params) => {
      if (pageNum > 1) params.set("page", String(pageNum));
      else params.delete("page");
      // Keep other filters
      return params;
    });
  };

  return {
    query,
    category,
    productId,
    page,
    updateQuery,
    updateCategory,
    updateProductId,
    updatePage,
  };
};
