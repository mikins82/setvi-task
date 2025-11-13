const STORAGE_KEY_PREFIX = "product_summary_";

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
    localStorage.setItem(`${STORAGE_KEY_PREFIX}${productId}`, summary);
  } catch (error) {
    console.error("Failed to save summary to localStorage:", error);
  }
};

/**
 * Retrieve a product summary from localStorage
 * @param productId - The product ID
 * @returns The saved summary text or null if not found
 */
export const getProductSummary = (productId: number): string | null => {
  try {
    return localStorage.getItem(`${STORAGE_KEY_PREFIX}${productId}`);
  } catch (error) {
    console.error("Failed to get summary from localStorage:", error);
    return null;
  }
};

/**
 * Clear a specific product summary from localStorage
 * @param productId - The product ID
 */
export const clearProductSummary = (productId: number): void => {
  try {
    localStorage.removeItem(`${STORAGE_KEY_PREFIX}${productId}`);
  } catch (error) {
    console.error("Failed to clear summary from localStorage:", error);
  }
};

/**
 * Clear all product summaries from localStorage
 */
export const clearAllSummaries = (): void => {
  try {
    const keys = Object.keys(localStorage);
    keys.forEach((key) => {
      if (key.startsWith(STORAGE_KEY_PREFIX)) {
        localStorage.removeItem(key);
      }
    });
  } catch (error) {
    console.error("Failed to clear all summaries:", error);
  }
};

