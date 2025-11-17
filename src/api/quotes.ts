import type { Quote, QuotesResponse } from "./types";

export const fetchQuotes = async (): Promise<QuotesResponse> => {
  const response = await fetch("https://dummyjson.com/quotes");
  if (!response.ok) throw new Error("Failed to fetch quotes");
  return response.json() as Promise<QuotesResponse>;
};

export const mergeQuotesIntoText = (quotes: Quote[]): string => {
  return quotes.map((q) => q.quote).join(" ");
};

