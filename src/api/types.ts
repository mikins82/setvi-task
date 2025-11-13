export type Product = {
  id: number;
  title: string;
  description: string;
  price: number;
  rating: number;
  category: string;
  thumbnail?: string;
  images?: string[];
  tags?: string[];
  stock?: number;
  brand?: string;
};

export type ProductsResponse = {
  products: Product[];
  total: number;
  skip: number;
  limit: number;
};

export type Quote = {
  id: number;
  quote: string;
  author: string;
};

export type QuotesResponse = {
  quotes: Quote[];
  total: number;
  skip: number;
  limit: number;
};

export type Category = {
  slug: string;
  name: string;
  url: string;
};

