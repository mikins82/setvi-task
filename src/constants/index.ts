/**
 * Application-wide constants and configuration values
 * Centralized location for all magic strings, numbers, and configuration
 */

// ===========================
// API Configuration
// ===========================
export const API = {
  BASE_URL: "https://dummyjson.com",
  ENDPOINTS: {
    PRODUCTS: "/products",
    CATEGORIES: "/products/categories",
    QUOTES: "/quotes",
    SEARCH: "/products/search",
    CATEGORY: (category: string) => `/products/category/${category}`,
    PRODUCT_BY_ID: (id: string) => `/products/${id}`,
  },
} as const;

// ===========================
// Error Messages
// ===========================
export const ERROR_MESSAGES = {
  FETCH_PRODUCTS: "Failed to fetch products",
  FETCH_PRODUCT: "Failed to fetch product",
  FETCH_CATEGORIES: "Failed to fetch categories",
  FETCH_QUOTES: "Failed to fetch quotes",
  GENERIC: "Something went wrong. Please try again.",
  SAVE_SUMMARY: "Failed to save summary to localStorage:",
  GET_SUMMARY: "Failed to get summary from localStorage:",
  CLEAR_SUMMARY: "Failed to clear summary from localStorage:",
  CLEAR_ALL_SUMMARIES: "Failed to clear all summaries:",
} as const;

// ===========================
// UI Text / Labels
// ===========================
export const UI_TEXT = {
  // App level
  APP_TITLE: "Product Browser",
  SKIP_TO_CONTENT: "Skip to main content",
  MAIN_CONTENT_ID: "main-content",

  // Search and Filters
  SEARCH_PLACEHOLDER: "Search products...",
  SEARCH_ARIA_LABEL: "Search products",
  SEARCH_REGION_LABEL: "Product search and filters",
  CLEAR_SEARCH: "Clear search",
  FILTER_CATEGORY_LABEL: "Category",
  FILTER_BY_CATEGORY: "Filter by category",
  ALL_CATEGORIES: "All Categories",
  LOADING_CATEGORIES: "Loading categories...",

  // Table Headers
  TABLE_HEADER_THUMBNAIL: "Thumbnail",
  TABLE_HEADER_TITLE: "Title",
  TABLE_HEADER_CATEGORY: "Category",
  TABLE_HEADER_PRICE: "Price",
  TABLE_HEADER_RATING: "Rating",

  // Product Table
  PRODUCT_LIST_LABEL: "Product list",
  PRODUCTS_TABLE_LABEL: "Products table with infinite scroll",
  LOADING_PRODUCTS: "Loading products",
  LOADING_MORE_PRODUCTS: "Loading more products...",
  LOADING_MORE_PRODUCTS_LABEL: "Loading more products",

  // Product Drawer
  PRODUCT_DETAILS: "Product Details",
  CLOSE_DRAWER: "Close product details drawer",
  DRAWER_TITLE_ID: "drawer-title",
  BRAND_PREFIX: "Brand: ",
  STOCK_PREFIX: "Stock: ",
  STOCK_UNITS: " units",
  TAGS_LABEL: "Tags:",

  // AI Summary
  AI_SUMMARY: "AI Summary",
  GENERATE_SUMMARY: "Generate Summary",
  REGENERATE_SUMMARY: "Regenerate Summary",
  GENERATE_SUMMARY_ARIA: "Generate AI summary for this product",
  REGENERATE_SUMMARY_ARIA: "Regenerate AI summary",
  GENERATING_SUMMARY: "Generating summary",
  SUMMARY_COMPLETE: "Summary complete",
  AI_SUMMARY_REGION: "AI-generated product summary",

  // Empty State
  NO_PRODUCTS_FOUND: "No products found.",
  NO_PRODUCTS_WITH_FILTERS:
    "No products found. Try adjusting your search or filters.",

  // Error State
  RETRY_BUTTON: "Retry",

  // Product Row
  PRODUCT_ROW_ARIA: (
    title: string,
    category: string,
    price: number,
    rating: number
  ) =>
    `${title}, ${category}, $${price.toFixed(2)}, rated ${rating.toFixed(
      1
    )} stars. Press Enter to view details.`,
  PRESS_ENTER_TO_VIEW: "Press Enter to view details.",
} as const;

// ===========================
// Pagination & Data
// ===========================
export const PAGINATION = {
  ITEMS_PER_PAGE: 30,
  INITIAL_PAGE: 0,
} as const;

// ===========================
// Timing & Delays
// ===========================
export const TIMING = {
  DEBOUNCE_DELAY: 300, // ms
  TYPEWRITER_SPEED: 30, // ms per character
  TYPEWRITER_PUNCTUATION_DELAY: 150, // ms after punctuation
} as const;

// ===========================
// Virtualization
// ===========================
export const VIRTUALIZATION = {
  ROW_HEIGHT: 97, // px - estimated row height
  OVERSCAN: 5, // number of items to render outside viewport
  FETCH_THRESHOLD: 5, // load more when within this many items of the end
  URL_RESTORE_MIDDLE_OFFSET: 15, // scroll to middle of page when restoring from URL
  MAX_RESTORATION_ATTEMPTS: 10, // maximum attempts to load pages during URL restoration
} as const;

// ===========================
// Storage Keys
// ===========================
export const STORAGE = {
  KEY_PREFIX: "product_summary_",
  getProductSummaryKey: (productId: number) => `product_summary_${productId}`,
} as const;

// ===========================
// Keyboard Keys
// ===========================
export const KEYBOARD = {
  ENTER: "Enter",
  SPACE: " ",
  ESCAPE: "Escape",
} as const;

// ===========================
// Punctuation
// ===========================
export const PUNCTUATION = [".", "!", "?", ","] as const;

// ===========================
// React Query Configuration
// ===========================
export const QUERY_KEYS = {
  PRODUCTS: "products",
  PRODUCT: "product",
  CATEGORIES: "categories",
  QUOTES: "quotes",
} as const;

export const QUERY_CONFIG = {
  STALE_TIME_INFINITY: Infinity,
} as const;

// ===========================
// Symbols & Icons
// ===========================
export const SYMBOLS = {
  STAR: "⭐",
  DOLLAR: "$",
  CURSOR: "|",
} as const;

// ===========================
// Numeric Formatting
// ===========================
export const FORMATTING = {
  PRICE_DECIMALS: 2,
  RATING_DECIMALS: 1,
} as const;

// ===========================
// Image Configuration
// ===========================
export const IMAGES = {
  THUMBNAIL_SIZE: 60, // px
  DRAWER_IMAGE_HEIGHT: 150, // px
  MAX_DRAWER_IMAGES: 4,
} as const;

// ===========================
// Layout & Spacing
// ===========================
export const LAYOUT = {
  TABLE_HEIGHT: "60vh",
  DRAWER_WIDTH_MOBILE: "100vw",
  DRAWER_WIDTH_DESKTOP: 500, // px
  EMPTY_STATE_MIN_HEIGHT: 400, // px
  LOADING_STATE_MIN_HEIGHT: 400, // px
  ERROR_STATE_PADDING: 8, // spacing units
  EMPTY_STATE_PADDING: 8, // spacing units
  PRODUCT_DRAWER_PADDING: 3, // spacing units
} as const;

// ===========================
// Accessibility
// ===========================
export const A11Y = {
  TAB_INDEX_FOCUSABLE: 0,
  TAB_INDEX_NOT_FOCUSABLE: -1,
  ROLE: {
    SEARCH: "search",
    REGION: "region",
    TABLE: "table",
    ROW: "row",
    ROWGROUP: "rowgroup",
    STATUS: "status",
    DIALOG: "dialog",
    SEARCHBOX: "searchbox",
    ARTICLE: "article",
  },
  ARIA_LIVE: {
    POLITE: "polite" as const,
  },
} as const;
