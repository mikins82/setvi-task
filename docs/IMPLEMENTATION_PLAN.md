# Setvi Product Browser - Full Implementation Plan

## Prerequisites Assumed

- Vite + React 18 + TypeScript project already initialized
- Project runs with `npm run dev`

## Phase 1: Dependencies & Project Structure

### Install Required Packages

```bash
npm install @tanstack/react-query react-router-dom
npm install react-window react-window-infinite-loader
npm install @mui/material @mui/icons-material @emotion/react @emotion/styled
npm install -D @types/react-window
```

### Create Directory Structure

```
src/
├── api/
│   ├── products.ts
│   ├── quotes.ts
│   └── types.ts
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
│   ├── useProducts.ts
│   ├── useCategories.ts
│   ├── useTypewriter.ts
│   ├── useDebounce.ts
│   └── useURLState.ts
├── utils/
│   ├── storage.ts
│   └── constants.ts
├── types/
│   └── index.ts
├── App.tsx
└── main.tsx
```

## Phase 2: Core Infrastructure

### 2.1 API Layer & Types

Create `src/api/types.ts` with Product, ProductsResponse, Quote, QuotesResponse, Category types (lines 132-172 in DEVELOPMENT_PLAN.md)

Create `src/api/products.ts` with:

- `fetchProducts(params)` - handles search, category filter, pagination
- `fetchProductById(id)`
- `fetchCategories()`

Create `src/api/quotes.ts` with:

- `fetchQuotes()`
- `mergeQuotesIntoText(quotes)` - combines all quotes into single string

### 2.2 Setup React Query

Modify `src/main.tsx`:

- Import QueryClient, QueryClientProvider
- Configure QueryClient with staleTime, cacheTime, retry settings
- Wrap App with QueryClientProvider

### 2.3 Setup React Router

Modify `src/App.tsx`:

- Import BrowserRouter, Routes, Route
- Setup route with URL search params support
- Main route: "/" for product browser

### 2.4 Custom Hooks

Create `src/hooks/useDebounce.ts` - debounce with 300ms delay

Create `src/hooks/useURLState.ts` - manage query, category, productId in URL with:

- `updateQuery()`, `updateCategory()`, `updateProductId()`

## Phase 3: Search & Filters

### 3.1 SearchBar Component

Create `src/components/SearchFilters/SearchBar.tsx`:

- MUI TextField with controlled input
- Clear button (IconButton with CloseIcon)
- Loading indicator (CircularProgress)
- ARIA labels for accessibility

### 3.2 CategoryFilter Component

Create `src/hooks/useCategories.ts` - React Query hook for categories

Create `src/components/SearchFilters/CategoryFilter.tsx`:

- MUI Select component
- Fetch categories with useCategories hook
- "All Categories" option to clear filter
- Loading state

### 3.3 Integration

In `src/App.tsx`:

- Use useURLState hook
- Apply useDebounce to search query
- Pass handlers to SearchBar and CategoryFilter

## Phase 4: Virtualized Table with Infinite Scroll

### 4.1 Infinite Products Hook

Create `src/hooks/useProducts.ts`:

- useInfiniteQuery from React Query
- queryKey: ['products', { q, category }]
- getNextPageParam: calculate skip based on pages loaded
- ITEMS_PER_PAGE = 30

### 4.2 Table Components

Create `src/components/ProductTable/TableHeader.tsx`:

- Fixed header outside virtualized list
- Columns: Thumbnail, Title, Category, Price, Rating

Create `src/components/ProductTable/ProductRow.tsx`:

- React.memo for performance
- Display product with thumbnail image
- onClick and onKeyDown handlers (Enter/Space)
- tabIndex={0} for keyboard nav

Create `src/components/ProductTable/LoaderRow.tsx`:

- Skeleton or "Loading more..." message

### 4.3 Main Table Component

Create `src/components/ProductTable/ProductTable.tsx`:

- Import FixedSizeList from react-window
- Import InfiniteLoader from react-window-infinite-loader
- Flatten pages.flatMap(page => page.products)
- Memoize allProducts with useMemo
- Implement isItemLoaded and loadMoreItems
- Row renderer that renders ProductRow or LoaderRow
- Handle loading, error, empty states

### 4.4 Error & Empty States

Create `src/components/common/ErrorState.tsx` - error message with retry button

Create `src/components/common/EmptyState.tsx` - "No products found" message

## Phase 5: Product Detail Drawer

### 5.1 Drawer Component

Create `src/components/ProductDrawer/ProductDrawer.tsx`:

- MUI Drawer component (anchor="right")
- useQuery to fetch product by ID
- Display: title, description, price, rating, category, tags, images
- Close button (IconButton with CloseIcon)
- useEffect for Escape key listener
- Include AISummary component

### 5.2 State Management

In `src/App.tsx`:

- useState for selectedProductId
- Pass onRowClick handler to ProductTable
- Pass productId and onClose to ProductDrawer

## Phase 6: AI Summary with Typewriter

### 6.1 Typewriter Hook

Create `src/hooks/useTypewriter.ts`:

- State: displayedText, isComplete, isTyping, currentIndex
- Functions: start(), reset()
- useEffect with setTimeout for character-by-character
- Check for punctuation (. ! ? ,) and apply longer delay (150ms vs 30ms)

### 6.2 LocalStorage Utilities

Create `src/utils/storage.ts`:

- `saveProductSummary(productId, summary)`
- `getProductSummary(productId)`
- `clearProductSummary(productId)`
- `clearAllSummaries()`

### 6.3 AI Summary Component

Create `src/components/ProductDrawer/AISummary.tsx`:

- useState for summaryText
- useEffect to load from localStorage on mount
- useQuery for quotes (enabled: false, staleTime: Infinity)
- useTypewriter hook with summaryText
- "Generate Summary" button - calls refetch, merges quotes, saves to localStorage, starts typewriter
- Display typewriter text with blinking cursor (CSS animation)
- Hide cursor when isComplete
- "Regenerate Summary" button if already generated

Add CSS keyframe animation for blinking cursor in component

## Phase 7: Polish & Optimization

### 7.1 Performance

- Verify ProductRow uses React.memo
- Verify useMemo for allProducts
- Verify useCallback for event handlers
- Test scroll performance

### 7.2 Accessibility

- Add proper ARIA labels to inputs and buttons
- Verify keyboard navigation (Tab, Enter, Escape)
- Test focus management in drawer
- Add role="table", role="row" to table components

### 7.3 Error Handling

- Verify all API calls have error boundaries
- Test network failures
- Verify retry logic works

### 7.4 Loading States

- Add CircularProgress for initial load
- Verify loader row appears during infinite scroll
- Smooth transitions

## Phase 8: Documentation & Final Polish

### 8.1 Create README.md

Structure from lines 1114-1304 in DEVELOPMENT_PLAN.md:

- Setup & Run instructions
- Architecture overview with data flow
- Component hierarchy diagram
- Technology stack
- Key features list
- Project structure
- Trade-offs & future improvements
- Performance metrics target
- Manual testing checklist

### 8.2 Code Comments

- Add JSDoc comments to custom hooks
- Document complex functions
- Add comments to non-obvious logic

### 8.3 Final Testing

- Test all search and filter combinations
- Test infinite scroll with 100+ items
- Test drawer open/close
- Test typewriter animation
- Test localStorage persistence
- Test keyboard navigation
- Test URL sharing (copy/paste URL)
- Test browser back/forward buttons

## Implementation Notes

### Key Files to Reference in DEVELOPMENT_PLAN.md

- API layer examples: lines 176-227
- Hooks examples: lines 232-300, 402-430, 738-797
- Component examples: lines 447-622, 649-698, 814-902
- Storage utilities: lines 909-951

### Critical Implementation Details

1. React Query cache keys must include search params for proper invalidation
2. Virtualized list needs fixed row height (itemSize={80})
3. Typewriter needs cleanup in useEffect return
4. localStorage operations need try/catch
5. URL state should be single source of truth

### Testing Strategy

- Manual testing throughout implementation
- Test on different screen sizes
- Test with slow network (throttle in DevTools)
- Test with large datasets (scroll to 100+ items)

---

## Todo Checklist

- [ ] Install all required npm packages
- [ ] Create complete directory structure
- [ ] Implement API layer (types, products, quotes)
- [ ] Setup React Query in main.tsx
- [ ] Setup React Router in App.tsx
- [ ] Create custom hooks (useDebounce, useURLState, useCategories, useProducts)
- [ ] Implement SearchBar and CategoryFilter components
- [ ] Create table components (TableHeader, ProductRow, LoaderRow)
- [ ] Implement ProductTable with virtualization and infinite scroll
- [ ] Create ErrorState and EmptyState components
- [ ] Implement ProductDrawer component
- [ ] Create useTypewriter hook
- [ ] Implement localStorage utilities
- [ ] Create AISummary component
- [ ] Wire up all components in App.tsx
- [ ] Apply performance optimizations
- [ ] Add accessibility features
- [ ] Polish UI with MUI theme and styling
- [ ] Create comprehensive README.md
- [ ] Complete manual testing checklist

---

**Reference:** See `DEVELOPMENT_PLAN.md` for detailed code examples and complete specifications.
