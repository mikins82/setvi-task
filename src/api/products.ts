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

  if (q) {
    url = `${BASE_URL}/products/search?q=${encodeURIComponent(q)}`;
  } else if (category) {
    url = `${BASE_URL}/products/category/${encodeURIComponent(category)}`;
  }

  url += `${q ? "&" : "?"}limit=${limit}&skip=${skip}`;

  const response = await fetch(url);
  if (!response.ok) throw new Error("Failed to fetch products");
  return response.json();
};

export const fetchProductById = async (id: string): Promise<Product> => {
  const response = await fetch(`${BASE_URL}/products/${id}`);
  if (!response.ok) throw new Error("Failed to fetch product");
  return response.json();
};

export const fetchCategories = async (): Promise<Category[]> => {
  const response = await fetch(`${BASE_URL}/products/categories`);
  if (!response.ok) throw new Error("Failed to fetch categories");
  return response.json();
};

