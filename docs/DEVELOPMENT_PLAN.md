# Development Plan - Setvi Take-Home Task

## 📋 Project Overview

Build a small app that lets a user search, filter, and browse a large dataset in an infinite-scroll, virtualized table, open an item detail drawer, and generate an AI-style summary rendered with a typewriter effect.

### Required Stack

- React 18 + TypeScript
- React Query
- Styling: CSS Modules OR Styled Components OR MUI

### Data Sources

- **Products API**: https://dummyjson.com/products
- **Quotes API**: https://dummyjson.com/quotes

---

## 🏗️ Phase 1: Project Setup & Architecture (Day 1, ~2-3 hours)

### 1.1 Initialize Project

```bash
npm create vite@latest . -- --template react-ts
```

### 1.2 Install Dependencies

```bash
# Core
npm install @tanstack/react-query react-router-dom

# Virtualization
npm install react-window react-window-infinite-loader
npm install -D @types/react-window

# Styling (pick one - recommend MUI for faster development)
npm install @mui/material @mui/icons-material @emotion/react @emotion/styled

# Alternative: CSS Modules (already supported in Vite)
# Alternative: Styled Components
# npm install styled-components
# npm install -D @types/styled-components
```

### 1.3 Project Structure

```
src/
├── api/
│   ├── products.ts          # Product API calls
│   ├── quotes.ts            # Quotes API calls
│   └── types.ts             # API response types
├── components/
│   ├── ProductTable/
│   │   ├── ProductTable.tsx
│   │   ├── ProductRow.tsx
│   │   ├── TableHeader.tsx
│   │   └── LoaderRow.tsx
│   ├── ProductDrawer/
│   │   ├── ProductDrawer.tsx
│   │   └── AISummary.tsx
│   ├── SearchFilters/
│   │   ├── SearchBar.tsx
│   │   └── CategoryFilter.tsx
│   └── common/
│       ├── ErrorState.tsx
│       └── EmptyState.tsx
├── hooks/
│   ├── useProducts.ts       # React Query hook
│   ├── useCategories.ts     # Categories hook
│   ├── useTypewriter.ts     # Typewriter animation
│   ├── useDebounce.ts       # Debounce hook
│   └── useURLState.ts       # URL state management
├── utils/
│   ├── storage.ts           # localStorage helpers
│   └── constants.ts         # API URLs, defaults
├── types/
│   └── index.ts             # Shared types
├── App.tsx
└── main.tsx
```

---

## 🔧 Phase 2: Core Infrastructure (Day 1-2, ~3-4 hours)

### 2.1 Setup React Query Provider

**File: `main.tsx`**

- QueryClient configuration
- QueryClientProvider wrapper
- Default cache settings (staleTime, cacheTime)

```typescript
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 5 * 60 * 1000, // 5 minutes
      cacheTime: 10 * 60 * 1000, // 10 minutes
      refetchOnWindowFocus: false,
      retry: 1,
    },
  },
});
```

### 2.2 Setup React Router

**File: `App.tsx`**

- Route configuration with URL search params
- Sync between URL and component state
- BrowserRouter setup

```typescript
import { BrowserRouter, Routes, Route } from "react-router-dom";

// Routes:
// - / (main product browser)
// - URL params: ?q={search}&category={cat}&skip={offset}&productId={id}
```

### 2.3 API Layer

**File: `api/types.ts`**

```typescript
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
```

**File: `api/products.ts`**

```typescript
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
```

**File: `api/quotes.ts`**

```typescript
export const fetchQuotes = async (): Promise<QuotesResponse> => {
  const response = await fetch("https://dummyjson.com/quotes");
  if (!response.ok) throw new Error("Failed to fetch quotes");
  return response.json();
};

export const mergeQuotesIntoText = (quotes: Quote[]): string => {
  return quotes.map((q) => q.quote).join(" ");
};
```

### 2.4 Custom Hooks

**File: `hooks/useDebounce.ts`**

```typescript
import { useEffect, useState } from "react";

export function useDebounce<T>(value: T, delay: number = 300): T {
  const [debouncedValue, setDebouncedValue] = useState<T>(value);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => {
      clearTimeout(handler);
    };
  }, [value, delay]);

  return debouncedValue;
}
```

**File: `hooks/useURLState.ts`**

```typescript
import { useSearchParams } from "react-router-dom";

export const useURLState = () => {
  const [searchParams, setSearchParams] = useSearchParams();

  const query = searchParams.get("q") || "";
  const category = searchParams.get("category") || "";
  const productId = searchParams.get("productId") || "";

  const updateQuery = (q: string) => {
    setSearchParams((params) => {
      if (q) params.set("q", q);
      else params.delete("q");
      params.delete("category"); // Clear category when searching
      return params;
    });
  };

  const updateCategory = (cat: string) => {
    setSearchParams((params) => {
      if (cat) params.set("category", cat);
      else params.delete("category");
      params.delete("q"); // Clear search when filtering
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

  return {
    query,
    category,
    productId,
    updateQuery,
    updateCategory,
    updateProductId,
  };
};
```

---

## 🔍 Phase 3: Search & Filters (Day 2, ~2-3 hours)

### 3.1 Search Component

**File: `components/SearchFilters/SearchBar.tsx`**

Features:

- Controlled input with debounce
- Clear button
- Loading indicator
- Accessible (aria-label, role)

```typescript
interface SearchBarProps {
  value: string;
  onChange: (value: string) => void;
  isLoading?: boolean;
}

export const SearchBar: React.FC<SearchBarProps> = ({
  value,
  onChange,
  isLoading,
}) => {
  // Implementation with MUI TextField or native input
  // Debounce happens in parent via useDebounce hook
};
```

### 3.2 Category Filter

**File: `components/SearchFilters/CategoryFilter.tsx`**

Features:

- Fetch categories with useQuery
- Single or multi-select dropdown
- "All" option to clear filter
- Loading state

```typescript
interface CategoryFilterProps {
  value: string;
  onChange: (category: string) => void;
}

export const CategoryFilter: React.FC<CategoryFilterProps> = ({
  value,
  onChange,
}) => {
  const { data: categories, isLoading } = useCategories();
  // Implementation with MUI Select or native select
};
```

**File: `hooks/useCategories.ts`**

```typescript
import { useQuery } from "@tanstack/react-query";
import { fetchCategories } from "../api/products";

export const useCategories = () => {
  return useQuery({
    queryKey: ["categories"],
    queryFn: fetchCategories,
    staleTime: Infinity, // Categories rarely change
  });
};
```

### 3.3 URL State Integration

Sync filters with URL:

- `?q={searchTerm}&category={cat}&skip={offset}`
- Use `useSearchParams` from react-router-dom
- Update URL on filter change
- Read from URL on mount/reload

**Implementation in parent component:**

```typescript
const { query, category, updateQuery, updateCategory } = useURLState();
const debouncedQuery = useDebounce(query, 300);

// Use debouncedQuery in useInfiniteProducts hook
// Pass updateQuery and updateCategory to child components
```

---

## 📊 Phase 4: Virtualized Table (Day 2-3, ~4-5 hours)

### 4.1 React Query Infinite Hook

**File: `hooks/useProducts.ts`**

```typescript
import { useInfiniteQuery } from "@tanstack/react-query";
import { fetchProducts } from "../api/products";

const ITEMS_PER_PAGE = 30;

export const useInfiniteProducts = (params: {
  q?: string;
  category?: string;
}) => {
  return useInfiniteQuery({
    queryKey: ["products", { q: params.q, category: params.category }],
    queryFn: ({ pageParam = 0 }) =>
      fetchProducts({
        limit: ITEMS_PER_PAGE,
        skip: pageParam,
        q: params.q,
        category: params.category,
      }),
    getNextPageParam: (lastPage, allPages) => {
      const loaded = allPages.length * ITEMS_PER_PAGE;
      if (loaded < lastPage.total) {
        return loaded;
      }
      return undefined;
    },
    keepPreviousData: true,
  });
};
```

### 4.2 Virtual Table Implementation

**File: `components/ProductTable/ProductTable.tsx`**

Features:

- Fixed header (outside FixedSizeList)
- FixedSizeList for body rows
- Flatten pages into single array
- Memoized row renderer
- InfiniteLoader integration
- Scroll restoration after drawer close

```typescript
import { FixedSizeList as List } from "react-window";
import InfiniteLoader from "react-window-infinite-loader";

interface ProductTableProps {
  query: string;
  category: string;
  onRowClick: (productId: number) => void;
}

export const ProductTable: React.FC<ProductTableProps> = ({
  query,
  category,
  onRowClick,
}) => {
  const {
    data,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    isLoading,
    isError,
  } = useInfiniteProducts({ q: query, category });

  // Flatten all pages into single array
  const allProducts = useMemo(
    () => data?.pages.flatMap((page) => page.products) || [],
    [data]
  );

  const totalCount = data?.pages[0]?.total || 0;
  const itemCount = hasNextPage ? allProducts.length + 1 : allProducts.length;

  const isItemLoaded = (index: number) =>
    !hasNextPage || index < allProducts.length;

  const loadMoreItems = () => {
    if (!isFetchingNextPage) {
      fetchNextPage();
    }
  };

  // Row renderer
  const Row = ({
    index,
    style,
  }: {
    index: number;
    style: React.CSSProperties;
  }) => {
    if (!isItemLoaded(index)) {
      return <LoaderRow style={style} />;
    }

    const product = allProducts[index];
    return (
      <ProductRow
        key={product.id}
        product={product}
        style={style}
        onClick={() => onRowClick(product.id)}
      />
    );
  };

  if (isLoading) return <div>Loading...</div>;
  if (isError) return <ErrorState />;
  if (allProducts.length === 0) return <EmptyState />;

  return (
    <div>
      <TableHeader />
      <InfiniteLoader
        isItemLoaded={isItemLoaded}
        itemCount={itemCount}
        loadMoreItems={loadMoreItems}
      >
        {({ onItemsRendered, ref }) => (
          <List
            height={600}
            itemCount={itemCount}
            itemSize={80}
            width="100%"
            onItemsRendered={onItemsRendered}
            ref={ref}
          >
            {Row}
          </List>
        )}
      </InfiniteLoader>
    </div>
  );
};
```

**File: `components/ProductTable/TableHeader.tsx`**

```typescript
export const TableHeader: React.FC = () => {
  return (
    <div role="row" style={{ display: "flex", fontWeight: "bold" }}>
      <div style={{ width: "80px" }}>Thumbnail</div>
      <div style={{ width: "300px" }}>Title</div>
      <div style={{ width: "150px" }}>Category</div>
      <div style={{ width: "100px" }}>Price</div>
      <div style={{ width: "100px" }}>Rating</div>
    </div>
  );
};
```

**File: `components/ProductTable/ProductRow.tsx`**

```typescript
import React from "react";
import { Product } from "../../types";

interface ProductRowProps {
  product: Product;
  style: React.CSSProperties;
  onClick: () => void;
}

export const ProductRow: React.FC<ProductRowProps> = React.memo(
  ({ product, style, onClick }) => {
    const handleKeyDown = (e: React.KeyboardEvent) => {
      if (e.key === "Enter" || e.key === " ") {
        e.preventDefault();
        onClick();
      }
    };

    return (
      <div
        role="row"
        tabIndex={0}
        style={{
          ...style,
          display: "flex",
          alignItems: "center",
          cursor: "pointer",
          borderBottom: "1px solid #eee",
        }}
        onClick={onClick}
        onKeyDown={handleKeyDown}
      >
        <div style={{ width: "80px" }}>
          <img
            src={product.thumbnail}
            alt={product.title}
            style={{ width: 60, height: 60, objectFit: "cover" }}
          />
        </div>
        <div style={{ width: "300px" }}>{product.title}</div>
        <div style={{ width: "150px" }}>{product.category}</div>
        <div style={{ width: "100px" }}>${product.price.toFixed(2)}</div>
        <div style={{ width: "100px" }}>⭐ {product.rating.toFixed(1)}</div>
      </div>
    );
  }
);
```

**File: `components/ProductTable/LoaderRow.tsx`**

```typescript
interface LoaderRowProps {
  style: React.CSSProperties;
}

export const LoaderRow: React.FC<LoaderRowProps> = ({ style }) => {
  return (
    <div style={{ ...style, display: "flex", alignItems: "center" }}>
      <div>Loading more...</div>
    </div>
  );
};
```

### 4.3 Loading States

- **Initial loading**: Full-screen spinner
- **Fetching next page**: Loader row at bottom
- **Error state**: Error message with retry button
- **Empty state**: "No products found" message

---

## 🎨 Phase 5: Product Detail Drawer (Day 3, ~3-4 hours)

### 5.1 Drawer Component

**File: `components/ProductDrawer/ProductDrawer.tsx`**

Features:

- MUI Drawer (or custom implementation)
- Fetch product detail with useQuery
- Display: title, description, price, rating, tags, images
- Close button (X icon)
- Keyboard: Escape to close
- Focus management (trap focus)

```typescript
import { Drawer } from "@mui/material";
import { useQuery } from "@tanstack/react-query";
import { fetchProductById } from "../../api/products";
import { AISummary } from "./AISummary";

interface ProductDrawerProps {
  productId: string | null;
  onClose: () => void;
}

export const ProductDrawer: React.FC<ProductDrawerProps> = ({
  productId,
  onClose,
}) => {
  const { data: product, isLoading } = useQuery({
    queryKey: ["product", productId],
    queryFn: () => fetchProductById(productId!),
    enabled: !!productId,
  });

  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", handleEscape);
    return () => window.removeEventListener("keydown", handleEscape);
  }, [onClose]);

  return (
    <Drawer anchor="right" open={!!productId} onClose={onClose}>
      <div style={{ width: 500, padding: 20 }}>
        {isLoading ? (
          <div>Loading...</div>
        ) : product ? (
          <>
            <h2>{product.title}</h2>
            <p>{product.description}</p>
            <p>Price: ${product.price}</p>
            <p>Rating: {product.rating} ⭐</p>
            <p>Category: {product.category}</p>
            {product.tags && <p>Tags: {product.tags.join(", ")}</p>}

            <AISummary productId={product.id} />
          </>
        ) : null}
      </div>
    </Drawer>
  );
};
```

### 5.2 Drawer State Management

In parent component:

```typescript
const [selectedProductId, setSelectedProductId] = useState<string | null>(null);

const handleRowClick = (productId: number) => {
  setSelectedProductId(String(productId));
};

const handleCloseDrawer = () => {
  setSelectedProductId(null);
};
```

Optional: Sync with URL:

```typescript
// Add to useURLState hook
const productId = searchParams.get("productId") || null;
const updateProductId = (id: string | null) => {
  if (id) searchParams.set("productId", id);
  else searchParams.delete("productId");
  setSearchParams(searchParams);
};
```

---

## ✨ Phase 6: AI Summary with Typewriter (Day 3-4, ~4-5 hours)

### 6.1 Typewriter Hook

**File: `hooks/useTypewriter.ts`**

```typescript
import { useState, useEffect, useCallback } from "react";

interface UseTypewriterOptions {
  speed?: number;
  punctuationDelay?: number;
}

export const useTypewriter = (
  text: string,
  options: UseTypewriterOptions = {}
) => {
  const { speed = 30, punctuationDelay = 150 } = options;
  const [displayedText, setDisplayedText] = useState("");
  const [isComplete, setIsComplete] = useState(false);
  const [isTyping, setIsTyping] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);

  const start = useCallback(() => {
    setDisplayedText("");
    setCurrentIndex(0);
    setIsComplete(false);
    setIsTyping(true);
  }, []);

  const reset = useCallback(() => {
    setDisplayedText("");
    setCurrentIndex(0);
    setIsComplete(false);
    setIsTyping(false);
  }, []);

  useEffect(() => {
    if (!isTyping || currentIndex >= text.length) {
      if (currentIndex >= text.length && isTyping) {
        setIsComplete(true);
        setIsTyping(false);
      }
      return;
    }

    const currentChar = text[currentIndex];
    const isPunctuation = [".", "!", "?", ","].includes(currentChar);
    const delay = isPunctuation ? punctuationDelay : speed;

    const timer = setTimeout(() => {
      setDisplayedText((prev) => prev + currentChar);
      setCurrentIndex((prev) => prev + 1);
    }, delay);

    return () => clearTimeout(timer);
  }, [text, currentIndex, isTyping, speed, punctuationDelay]);

  return {
    displayedText,
    isComplete,
    isTyping,
    start,
    reset,
  };
};
```

### 6.2 AI Summary Component

**File: `components/ProductDrawer/AISummary.tsx`**

Features:

- "Generate Summary" button
- Fetch quotes on click
- Render with typewriter effect
- Blinking cursor (CSS animation)
- Hide cursor when complete
- Save to localStorage
- Load from localStorage if exists

```typescript
import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { fetchQuotes, mergeQuotesIntoText } from "../../api/quotes";
import { useTypewriter } from "../../hooks/useTypewriter";
import { getProductSummary, saveProductSummary } from "../../utils/storage";

interface AISummaryProps {
  productId: number;
}

export const AISummary: React.FC<AISummaryProps> = ({ productId }) => {
  const [summaryText, setSummaryText] = useState<string>("");
  const [shouldGenerate, setShouldGenerate] = useState(false);

  const { displayedText, isComplete, isTyping, start } = useTypewriter(
    summaryText,
    { speed: 30, punctuationDelay: 150 }
  );

  // Load from localStorage on mount
  useEffect(() => {
    const saved = getProductSummary(productId);
    if (saved) {
      setSummaryText(saved);
    }
  }, [productId]);

  // Fetch quotes
  const { data: quotesData, refetch } = useQuery({
    queryKey: ["quotes"],
    queryFn: fetchQuotes,
    enabled: false, // Don't fetch automatically
    staleTime: Infinity, // Cache forever
  });

  const handleGenerate = async () => {
    setShouldGenerate(true);
    const result = await refetch();
    if (result.data) {
      const text = mergeQuotesIntoText(result.data.quotes);
      setSummaryText(text);
      saveProductSummary(productId, text);
      start();
    }
  };

  if (summaryText && !isTyping && !shouldGenerate) {
    return (
      <div>
        <h3>AI Summary</h3>
        <p>{summaryText}</p>
        <button onClick={handleGenerate}>Regenerate Summary</button>
      </div>
    );
  }

  return (
    <div>
      <h3>AI Summary</h3>
      {!isTyping && !displayedText && (
        <button onClick={handleGenerate}>Generate Summary</button>
      )}
      {(isTyping || displayedText) && (
        <div style={{ position: "relative" }}>
          <p>
            {displayedText}
            {!isComplete && (
              <span
                className="cursor"
                style={{
                  animation: "blink 1s infinite",
                }}
              >
                |
              </span>
            )}
          </p>
        </div>
      )}
      <style>{`
        @keyframes blink {
          0%, 50% { opacity: 1; }
          51%, 100% { opacity: 0; }
        }
      `}</style>
    </div>
  );
};
```

### 6.3 LocalStorage Utilities

**File: `utils/storage.ts`**

```typescript
const STORAGE_KEY_PREFIX = "product_summary_";

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

export const getProductSummary = (productId: number): string | null => {
  try {
    return localStorage.getItem(`${STORAGE_KEY_PREFIX}${productId}`);
  } catch (error) {
    console.error("Failed to get summary from localStorage:", error);
    return null;
  }
};

export const clearProductSummary = (productId: number): void => {
  try {
    localStorage.removeItem(`${STORAGE_KEY_PREFIX}${productId}`);
  } catch (error) {
    console.error("Failed to clear summary from localStorage:", error);
  }
};

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
```

---

## 🎯 Phase 7: Polish & Optimization (Day 4, ~3-4 hours)

### 7.1 Performance Optimizations

#### Checklist:

- [ ] Memoize ProductRow with `React.memo`
- [ ] Use `useMemo` for filtered/flattened data
- [ ] Use `useCallback` for event handlers
- [ ] Avoid unnecessary re-renders (use React DevTools Profiler)
- [ ] Optimize query cache times
- [ ] Cancel requests on unmount
- [ ] Lazy load images
- [ ] Debounce scroll events

#### Example Optimizations:

```typescript
// Memoized row component
export const ProductRow = React.memo(
  ({ product, onClick }) => {
    // ...
  },
  (prevProps, nextProps) => {
    return prevProps.product.id === nextProps.product.id;
  }
);

// Memoized callbacks
const handleRowClick = useCallback((productId: number) => {
  setSelectedProductId(String(productId));
}, []);

// Memoized computed values
const allProducts = useMemo(
  () => data?.pages.flatMap((page) => page.products) || [],
  [data]
);
```

### 7.2 Accessibility

#### Checklist:

- [ ] Table semantics (`role="table"`, `role="row"`, `role="cell"`)
- [ ] Keyboard navigation (Tab, Enter, Escape)
- [ ] Focus management in drawer
- [ ] ARIA labels for buttons and inputs
- [ ] ARIA live regions for loading states
- [ ] Screen reader announcements
- [ ] Focus trap in modal/drawer
- [ ] Skip to content link
- [ ] Color contrast (WCAG AA minimum)

#### Implementation:

```typescript
// Keyboard navigation
const handleKeyDown = (e: React.KeyboardEvent) => {
  if (e.key === "Enter" || e.key === " ") {
    e.preventDefault();
    onClick();
  }
};

// ARIA labels
<input
  aria-label="Search products"
  aria-describedby="search-hint"
  role="searchbox"
/>;

// Focus trap in drawer
useEffect(() => {
  if (isOpen) {
    const firstFocusable = drawerRef.current?.querySelector("button");
    firstFocusable?.focus();
  }
}, [isOpen]);
```

### 7.3 Error Handling

#### Checklist:

- [ ] Network error states with user-friendly messages
- [ ] Retry logic (React Query provides default)
- [ ] Empty states with helpful messages
- [ ] Timeout handling
- [ ] 404 handling
- [ ] API error messages display
- [ ] Graceful degradation

#### Components:

**File: `components/common/ErrorState.tsx`**

```typescript
interface ErrorStateProps {
  message?: string;
  onRetry?: () => void;
}

export const ErrorState: React.FC<ErrorStateProps> = ({
  message = "Something went wrong. Please try again.",
  onRetry,
}) => {
  return (
    <div style={{ padding: 40, textAlign: "center" }}>
      <p>{message}</p>
      {onRetry && <button onClick={onRetry}>Retry</button>}
    </div>
  );
};
```

**File: `components/common/EmptyState.tsx`**

```typescript
interface EmptyStateProps {
  message?: string;
  action?: {
    label: string;
    onClick: () => void;
  };
}

export const EmptyState: React.FC<EmptyStateProps> = ({
  message = "No products found.",
  action,
}) => {
  return (
    <div style={{ padding: 40, textAlign: "center" }}>
      <p>{message}</p>
      {action && <button onClick={action.onClick}>{action.label}</button>}
    </div>
  );
};
```

### 7.4 Loading States

#### Checklist:

- [ ] Skeleton loaders for initial load
- [ ] Spinner for button actions
- [ ] Progress indicators
- [ ] Smooth transitions
- [ ] Loading text for screen readers

---

## 📝 Phase 8: Documentation (Day 4-5, ~2-3 hours)

### 8.1 README.md Structure

Create a comprehensive `README.md` at project root:

````markdown
# Product Browser with AI Summary

A modern React application for browsing products with advanced search, infinite scroll virtualization, and AI-powered summaries.

## 🚀 Setup & Run

### Prerequisites

- Node.js 16+
- npm or yarn

### Installation

\`\`\`bash
npm install
\`\`\`

### Development

\`\`\`bash
npm run dev
\`\`\`

Open [http://localhost:5173](http://localhost:5173)

### Build

\`\`\`bash
npm run build
\`\`\`

## 🏗️ Architecture Overview

### Data Flow

1. User interacts with search/filters
2. URL state updates via React Router
3. React Query fetches data from DummyJSON API
4. Virtualized table renders visible rows only
5. Product detail opens in drawer
6. AI summary generates with typewriter effect

### Component Hierarchy

\`\`\`
App
├── SearchFilters
│ ├── SearchBar
│ └── CategoryFilter
├── ProductTable (react-window)
│ ├── TableHeader
│ ├── ProductRow
│ └── LoaderRow
└── ProductDrawer
├── Product Details
└── AISummary (typewriter)
\`\`\`

### State Management

- **URL State**: Search params, filters (React Router)
- **Server State**: Products, categories (React Query)
- **Local State**: Drawer open/close, typewriter animation
- **LocalStorage**: AI summaries persistence

## 🛠️ Technology Stack

- **React 18** - UI framework
- **TypeScript** - Type safety
- **React Query (TanStack Query)** - Server state management
- **React Window** - Virtualization for performance
- **React Router** - URL state management
- **MUI (Material-UI)** - Component library & styling
- **Vite** - Build tool

## ✨ Key Features

### 1. Search & Filters

- Debounced search (300ms)
- Category filtering
- URL state persistence
- Server-side pagination

### 2. Infinite Scroll Virtualized Table

- React Window for performance
- Fixed header, virtualized body
- Smooth scrolling with 1000+ items
- Automatic fetch on scroll

### 3. Product Detail Drawer

- Right-side drawer with full details
- Keyboard navigation (Escape to close)
- Focus management

### 4. AI Summary with Typewriter Effect

- Character-by-character animation
- Longer delays after punctuation
- Blinking cursor
- LocalStorage persistence per product

## 📁 Project Structure

\`\`\`
src/
├── api/ # API calls and types
├── components/ # React components
├── hooks/ # Custom hooks
├── utils/ # Utility functions
└── types/ # TypeScript types
\`\`\`

## 🎯 Trade-offs & Future Improvements

### Trade-offs Made

1. **Fixed row height** - Simpler virtualization, but less flexible layouts
2. **Single category filter** - Easier UX, but less powerful than multi-select
3. **Client-side typewriter** - Simple implementation, but not truly "AI"
4. **LocalStorage** - Easy persistence, but limited storage and no sync across devices

### Future Improvements

1. **Advanced Search**

   - Multi-category filter
   - Price range slider
   - Rating filter
   - Sort options (price, rating, name)

2. **Performance**

   - Image lazy loading with intersection observer
   - Virtual scrolling for drawer images
   - Service worker for offline support
   - CDN for API responses

3. **UX Enhancements**

   - Dark mode toggle
   - Animations and transitions
   - Toast notifications
   - Skeleton loaders
   - Grid/List view toggle

4. **Accessibility**

   - Improved keyboard shortcuts
   - Better screen reader support
   - High contrast mode
   - Reduced motion support

5. **Testing**

   - Unit tests (Vitest)
   - Integration tests (React Testing Library)
   - E2E tests (Playwright)

6. **Real AI Integration**
   - OpenAI API for actual summaries
   - Streaming responses
   - Custom prompts per product

## 📊 Performance Metrics

- **Initial Load**: < 2s
- **Search Response**: < 300ms (debounced)
- **Scroll Performance**: 60 FPS with 1000+ items
- **Bundle Size**: < 500KB (gzipped)

## 🧪 Manual Testing Checklist

- [ ] Search returns correct results
- [ ] Category filter works
- [ ] Infinite scroll loads more items
- [ ] URL updates on search/filter
- [ ] Browser back/forward works
- [ ] Drawer opens/closes correctly
- [ ] AI summary generates and persists
- [ ] Keyboard navigation works
- [ ] Error states display properly
- [ ] Empty states display properly

## 📄 License

MIT
\`\`\`

### 8.2 Code Comments

Add JSDoc comments to:

- Complex functions
- Custom hooks
- Non-obvious logic
- Type definitions

Example:

```typescript
/**
 * Custom hook for managing infinite product list with React Query
 *
 * @param params - Search and filter parameters
 * @param params.q - Search query string
 * @param params.category - Category filter
 * @returns React Query infinite query result with products
 */
export const useInfiniteProducts = (params: {
  q?: string;
  category?: string;
}) => {
  // ...
};
```
````

---

## 🎯 Implementation Priority Order

### Critical Path (Must-haves)

1. ✅ Project setup + dependencies
2. ✅ API layer + types
3. ✅ Basic product list (no virtualization yet)
4. ✅ React Query infinite hook
5. ✅ Virtualized table with react-window
6. ✅ Search + category filters
7. ✅ URL state management
8. ✅ Product detail drawer
9. ✅ Typewriter effect
10. ✅ LocalStorage persistence

### Important (Should-haves)

11. ✅ Error states
12. ✅ Loading states
13. ✅ Accessibility basics
14. ✅ Performance optimization
15. ✅ README documentation

### Nice-to-haves (If time permits)

- Advanced keyboard shortcuts
- Animations/transitions
- Dark mode
- Advanced filtering (price range, rating)
- Sort options
- Tests

---

## 🔑 Key Technical Decisions

### 1. Styling Choice: Material-UI (MUI)

**Rationale:**

- Faster development with pre-built components
- Built-in accessibility features
- Professional, consistent look
- Good TypeScript support
- Easy theming

**Alternative:** CSS Modules for more control and lighter bundle size

### 2. URL State Management

**Approach:** React Router's `useSearchParams`

**Benefits:**

- Shareable URLs
- Browser back/forward support
- Bookmark-able states
- SEO friendly (if server-rendered)

### 3. Virtualization Library: react-window

**Rationale:**

- Lightweight (2.6kb gzipped)
- Good performance
- Simpler API than react-virtualized
- Active maintenance
- Good TypeScript support

**Consideration:** Use `FixedSizeList` for consistent row height (simpler, faster)

### 4. Infinite Scroll Strategy

**Approach:** React Query's `useInfiniteQuery` + `react-window-infinite-loader`

**Benefits:**

- Automatic caching and deduplication
- Built-in retry logic
- Loading states management
- Stale-while-revalidate pattern
- No manual pagination state

### 5. Typewriter Implementation

**Approach:** Custom hook with `setTimeout` and state

**Enhancement:**

- Variable delays for punctuation (2x normal speed)
- CSS blinking cursor animation
- Start/stop/reset controls

---

## ⚠️ Potential Pitfalls & Solutions

| Pitfall                                   | Solution                                                           |
| ----------------------------------------- | ------------------------------------------------------------------ |
| Scroll position lost after closing drawer | Store scroll offset in ref, restore on drawer close                |
| Too many re-renders in virtualized list   | Memoize row components with React.memo, use proper comparison      |
| Quotes API called multiple times          | Fetch once with `staleTime: Infinity` in React Query               |
| Search triggers too many requests         | Debounce input with 300ms delay using custom hook                  |
| URL state sync issues                     | Use URL as single source of truth, derive component state from URL |
| Virtualization jumpy/flickering           | Use fixed row height, proper `getItemSize` function                |
| Typewriter effect laggy                   | Use `requestAnimationFrame` instead of `setTimeout` (optional)     |
| Images not loading                        | Add error handling, fallback placeholder images                    |
| Memory leaks in effects                   | Clean up timeouts/intervals in useEffect return function           |
| Race conditions in async requests         | Use React Query's automatic request cancellation                   |

---

## 📊 Time Estimation

- **Total Time:** 18-24 hours over 4-5 days
- **Day 1:** Setup + Infrastructure (5-7 hours)
  - Project setup (1h)
  - API layer (2h)
  - React Query setup (1h)
  - Custom hooks (2h)
- **Day 2:** Search, Filters, Table (6-8 hours)
  - Search & filters UI (2h)
  - Virtualized table (3h)
  - URL state integration (1h)
  - Loading/error states (1h)
- **Day 3:** Drawer, Typewriter (7-9 hours)
  - Product drawer (3h)
  - Typewriter hook (2h)
  - AI summary component (2h)
  - LocalStorage integration (1h)
- **Day 4:** Polish, Testing, Documentation (3-5 hours)
  - Performance optimization (1h)
  - Accessibility (1h)
  - Manual testing (1h)
  - README + comments (1-2h)

---

## 🚦 Evaluation Rubric Alignment

### Architecture & Code Quality (30 pts)

- ✅ Clear separation of concerns (api/, components/, hooks/)
- ✅ Consistent patterns (custom hooks, component structure)
- ✅ Readable, maintainable code
- ✅ Proper TypeScript usage

### Async & Pagination Correctness (20 pts)

- ✅ Infinite loading with proper limit/skip math
- ✅ React Query handles cancel/retry automatically
- ✅ Error handling at API and UI levels
- ✅ Loading states throughout

### Virtualization Quality (20 pts)

- ✅ Smooth scroll with react-window
- ✅ Loader row behavior (triggers fetchNextPage)
- ✅ Scroll position management
- ✅ Performance with 1000+ items

### UX & Accessibility (20 pts)

- ✅ Keyboard navigation (Tab, Enter, Escape)
- ✅ Focus management (drawer, rows)
- ✅ Empty/error states with helpful messages
- ✅ ARIA labels and roles
- ✅ Screen reader support

### Type Safety & Styling (10 pts)

- ✅ TypeScript for API models, props, hooks
- ✅ Consistent styling approach (MUI)
- ✅ Clean, modern UI

---

## 🎬 Getting Started

### Day 1 Morning: Project Setup

```bash
# Initialize Vite project
npm create vite@latest . -- --template react-ts

# Install dependencies
npm install @tanstack/react-query react-router-dom
npm install react-window react-window-infinite-loader
npm install @mui/material @mui/icons-material @emotion/react @emotion/styled
npm install -D @types/react-window

# Start development
npm run dev
```

### Day 1 Afternoon: API Layer

- Create `api/types.ts` with Product, ProductsResponse, QuotesResponse
- Create `api/products.ts` with fetch functions
- Create `api/quotes.ts` with fetch functions
- Test API calls in browser console

### Day 2: Core Features

- Implement search and filters
- Build virtualized table
- Integrate React Query infinite queries
- Add URL state management

### Day 3: Detail View & AI

- Build product drawer
- Implement typewriter effect
- Add localStorage persistence

### Day 4: Polish & Ship

- Optimize performance
- Improve accessibility
- Write comprehensive README
- Manual testing
- Push to GitHub

---

## 📚 Helpful Resources

- [React Query Docs](https://tanstack.com/query/latest/docs/react/overview)
- [react-window Examples](https://react-window.vercel.app/)
- [MUI Components](https://mui.com/material-ui/getting-started/)
- [DummyJSON API](https://dummyjson.com/docs)
- [React Router Docs](https://reactrouter.com/)

---

## ✅ Final Checklist Before Submission

- [ ] All required features implemented
- [ ] No console errors or warnings
- [ ] Virtualization working smoothly
- [ ] Search and filters functional
- [ ] URL state persists and is shareable
- [ ] Drawer opens/closes correctly
- [ ] Typewriter effect works properly
- [ ] LocalStorage saves summaries
- [ ] Error states display properly
- [ ] Loading states display properly
- [ ] Keyboard navigation works
- [ ] Code is clean and well-organized
- [ ] TypeScript types are comprehensive
- [ ] README is complete and accurate
- [ ] Repository is public on GitHub
- [ ] Git history shows incremental progress
- [ ] No sensitive data or API keys committed

---

## 🎯 Success Criteria

### Hard Requirements (Must Have)

✅ Virtualization with react-window  
✅ Infinite scroll working  
✅ Pagination math correct (limit/skip)  
✅ Typewriter summary implemented  
✅ Loading/error states present  
✅ Non-blocking renders

### Quality Indicators (Should Have)

✅ Clean component structure  
✅ Proper TypeScript usage  
✅ Sensible React Query cache keys  
✅ Accessible keyboard navigation  
✅ URL state management  
✅ LocalStorage persistence

### Excellence Markers (Nice to Have)

✅ Performance optimizations (memo, callback)  
✅ Comprehensive README  
✅ Thoughtful trade-offs documented  
✅ Clean git history  
✅ Extra polish (animations, UX)

---

**Good luck with your implementation! 🚀**

This is a well-scoped take-home that should take 18-24 hours to complete thoroughly. Focus on getting the core features working first, then polish as time permits.
