import { API, ERROR_MESSAGES } from "../constants";
import type { Category, Product, ProductsResponse } from "./types";

export const fetchProducts = async (params: {
  limit: number;
  skip: number;
  q?: string;
  category?: string;
}): Promise<ProductsResponse> => {
  const { limit, skip, q, category } = params;

  let url = `${API.BASE_URL}${API.ENDPOINTS.PRODUCTS}`;

  // Support combining category and query
  if (category) {
    // If category is set, use category endpoint and add query if present
    url = `${API.BASE_URL}${API.ENDPOINTS.CATEGORY(category)}`;
    if (q) {
      url += `?q=${encodeURIComponent(q)}&limit=${limit}&skip=${skip}`;
    } else {
      url += `?limit=${limit}&skip=${skip}`;
    }
  } else if (q) {
    // If only query is set, use search endpoint
    url = `${API.BASE_URL}${API.ENDPOINTS.SEARCH}?q=${encodeURIComponent(
      q
    )}&limit=${limit}&skip=${skip}`;
  } else {
    // No filters, use base products endpoint
    url += `?limit=${limit}&skip=${skip}`;
  }

  const response = await fetch(url);
  if (!response.ok) throw new Error(ERROR_MESSAGES.FETCH_PRODUCTS);
  return response.json() as Promise<ProductsResponse>;
};

export const fetchProductById = async (id: string): Promise<Product> => {
  const response = await fetch(
    `${API.BASE_URL}${API.ENDPOINTS.PRODUCT_BY_ID(id)}`
  );
  if (!response.ok) throw new Error(ERROR_MESSAGES.FETCH_PRODUCT);
  return response.json() as Promise<Product>;
};

export const fetchCategories = async (): Promise<Category[]> => {
  const response = await fetch(`${API.BASE_URL}${API.ENDPOINTS.CATEGORIES}`);
  if (!response.ok) throw new Error(ERROR_MESSAGES.FETCH_CATEGORIES);
  return response.json() as Promise<Category[]>;
};
