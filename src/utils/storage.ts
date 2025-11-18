import { STORAGE, ERROR_MESSAGES } from "../constants";

/**
 * Save a product summary to localStorage
 * @param productId - The product ID
 * @param summary - The summary text to save
 */
export const saveProductSummary = (
  productId: number,
  summary: string
): void => {
  try {
    localStorage.setItem(STORAGE.getProductSummaryKey(productId), summary);
  } catch (error) {
    console.error(ERROR_MESSAGES.SAVE_SUMMARY, error);
  }
};

/**
 * Retrieve a product summary from localStorage
 * @param productId - The product ID
 * @returns The saved summary text or null if not found
 */
export const getProductSummary = (productId: number): string | null => {
  try {
    return localStorage.getItem(STORAGE.getProductSummaryKey(productId));
  } catch (error) {
    console.error(ERROR_MESSAGES.GET_SUMMARY, error);
    return null;
  }
};

/**
 * Clear a specific product summary from localStorage
 * @param productId - The product ID
 */
export const clearProductSummary = (productId: number): void => {
  try {
    localStorage.removeItem(STORAGE.getProductSummaryKey(productId));
  } catch (error) {
    console.error(ERROR_MESSAGES.CLEAR_SUMMARY, error);
  }
};

/**
 * Clear all product summaries from localStorage
 */
export const clearAllSummaries = (): void => {
  try {
    const keys = Object.keys(localStorage);
    keys.forEach((key) => {
      if (key.startsWith(STORAGE.KEY_PREFIX)) {
        localStorage.removeItem(key);
      }
    });
  } catch (error) {
    console.error(ERROR_MESSAGES.CLEAR_ALL_SUMMARIES, error);
  }
};

