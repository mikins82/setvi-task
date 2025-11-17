import type { Product, ProductsResponse, Category } from "./types";

const BASE_URL = "https://dummyjson.com";

export const fetchProducts = async (params: {
  limit: number;
  skip: number;
  q?: string;
  category?: string;
}): Promise<ProductsResponse> => {
  const { limit, skip, q, category } = params;

  let url = `${BASE_URL}/products`;

  // Support combining category and query
  if (category) {
    // If category is set, use category endpoint and add query if present
    url = `${BASE_URL}/products/category/${encodeURIComponent(category)}`;
    if (q) {
      url += `?q=${encodeURIComponent(q)}&limit=${limit}&skip=${skip}`;
    } else {
      url += `?limit=${limit}&skip=${skip}`;
    }
  } else if (q) {
    // If only query is set, use search endpoint
    url = `${BASE_URL}/products/search?q=${encodeURIComponent(q)}&limit=${limit}&skip=${skip}`;
  } else {
    // No filters, use base products endpoint
    url += `?limit=${limit}&skip=${skip}`;
  }

  const response = await fetch(url);
  if (!response.ok) throw new Error("Failed to fetch products");
  return response.json() as Promise<ProductsResponse>;
};

export const fetchProductById = async (id: string): Promise<Product> => {
  const response = await fetch(`${BASE_URL}/products/${id}`);
  if (!response.ok) throw new Error("Failed to fetch product");
  return response.json() as Promise<Product>;
};

export const fetchCategories = async (): Promise<Category[]> => {
  const response = await fetch(`${BASE_URL}/products/categories`);
  if (!response.ok) throw new Error("Failed to fetch categories");
  return response.json() as Promise<Category[]>;
};

