import { API, ERROR_MESSAGES } from "../constants";
import type { Quote, QuotesResponse } from "./types";

export const fetchQuotes = async (): Promise<QuotesResponse> => {
  const response = await fetch(`${API.BASE_URL}${API.ENDPOINTS.QUOTES}`);
  if (!response.ok) throw new Error(ERROR_MESSAGES.FETCH_QUOTES);
  return response.json() as Promise<QuotesResponse>;
};

export const mergeQuotesIntoText = (quotes: Quote[]): string => {
  return quotes.map((q) => q.quote).join(" ");
};
