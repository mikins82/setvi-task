# Constants Refactoring - Before & After Examples

## Example 1: API Endpoints

### Before
```typescript
// src/api/products.ts
const BASE_URL = "https://dummyjson.com";

export const fetchProducts = async (params) => {
  let url = `${BASE_URL}/products`;
  if (category) {
    url = `${BASE_URL}/products/category/${encodeURIComponent(category)}`;
  }
  const response = await fetch(url);
  if (!response.ok) throw new Error("Failed to fetch products");
  return response.json();
};
```

### After
```typescript
// src/api/products.ts
import { API, ERROR_MESSAGES } from "../constants";

export const fetchProducts = async (params) => {
  let url = `${API.BASE_URL}${API.ENDPOINTS.PRODUCTS}`;
  if (category) {
    url = `${API.BASE_URL}${API.ENDPOINTS.CATEGORY(category)}`;
  }
  const response = await fetch(url);
  if (!response.ok) throw new Error(ERROR_MESSAGES.FETCH_PRODUCTS);
  return response.json();
};
```

**Benefits:**
- API URL can be changed in one place
- Error messages are consistent across the app
- Endpoints are type-safe and autocompleted

---

## Example 2: UI Text

### Before
```tsx
// src/App.tsx
<Typography variant="h3" component="h1">
  Product Browser
</Typography>

<a href="#main-content">
  Skip to main content
</a>
```

### After
```tsx
// src/App.tsx
import { UI_TEXT } from "./constants";

<Typography variant="h3" component="h1">
  {UI_TEXT.APP_TITLE}
</Typography>

<a href={`#${UI_TEXT.MAIN_CONTENT_ID}`}>
  {UI_TEXT.SKIP_TO_CONTENT}
</a>
```

**Benefits:**
- Easy to implement internationalization (i18n)
- Consistent text across the application
- Easy to find and update all UI text

---

## Example 3: Configuration Values

### Before
```typescript
// src/hooks/useProducts.ts
const ITEMS_PER_PAGE = 30;

export const useInfiniteProducts = (params) => {
  return useInfiniteQuery({
    queryKey: ["products", { q: params.q, category: params.category }],
    queryFn: ({ pageParam = 0 }) =>
      fetchProducts({
        limit: ITEMS_PER_PAGE,
        skip: pageParam,
        q: params.q,
        category: params.category,
      }),
  });
};
```

### After
```typescript
// src/hooks/useProducts.ts
import { PAGINATION, QUERY_KEYS } from "../constants";

export const useInfiniteProducts = (params) => {
  return useInfiniteQuery({
    queryKey: [QUERY_KEYS.PRODUCTS, { q: params.q, category: params.category }],
    queryFn: ({ pageParam = 0 }) =>
      fetchProducts({
        limit: PAGINATION.ITEMS_PER_PAGE,
        skip: pageParam,
        q: params.q,
        category: params.category,
      }),
  });
};
```

**Benefits:**
- Configuration values centralized
- Easy to test with different values
- Query keys are consistent across the app

---

## Example 4: Magic Numbers

### Before
```tsx
// src/components/ProductDrawer/ProductDrawer.tsx
<Box sx={{ width: { xs: "100vw", sm: 500 }, p: 3 }}>
  {product.images.slice(0, 4).map((image, index) => (
    <Box
      component="img"
      src={image}
      sx={{
        width: "100%",
        height: 150,
        objectFit: "cover",
      }}
    />
  ))}
  <Typography variant="h5" color="primary">
    ${product.price.toFixed(2)}
  </Typography>
  <Typography variant="h6" color="text.secondary">
    ⭐ {product.rating.toFixed(1)}
  </Typography>
</Box>
```

### After
```tsx
// src/components/ProductDrawer/ProductDrawer.tsx
import { LAYOUT, IMAGES, FORMATTING, SYMBOLS } from "../../constants";

<Box sx={{ width: { xs: LAYOUT.DRAWER_WIDTH_MOBILE, sm: LAYOUT.DRAWER_WIDTH_DESKTOP }, p: LAYOUT.PRODUCT_DRAWER_PADDING }}>
  {product.images.slice(0, IMAGES.MAX_DRAWER_IMAGES).map((image, index) => (
    <Box
      component="img"
      src={image}
      sx={{
        width: "100%",
        height: IMAGES.DRAWER_IMAGE_HEIGHT,
        objectFit: "cover",
      }}
    />
  ))}
  <Typography variant="h5" color="primary">
    {SYMBOLS.DOLLAR}{product.price.toFixed(FORMATTING.PRICE_DECIMALS)}
  </Typography>
  <Typography variant="h6" color="text.secondary">
    {SYMBOLS.STAR} {product.rating.toFixed(FORMATTING.RATING_DECIMALS)}
  </Typography>
</Box>
```

**Benefits:**
- No more "magic numbers" scattered throughout the code
- Easy to maintain consistent spacing and sizing
- Clear naming makes the purpose of each value obvious

---

## Example 5: Accessibility

### Before
```tsx
// src/components/ProductTable/ProductTable.tsx
<Box
  role="status"
  aria-live="polite"
  aria-busy="true"
  aria-label="Loading products"
>
  <CircularProgress />
</Box>
```

### After
```tsx
// src/components/ProductTable/ProductTable.tsx
import { A11Y, UI_TEXT } from "../../constants";

<Box
  role={A11Y.ROLE.STATUS}
  aria-live={A11Y.ARIA_LIVE.POLITE}
  aria-busy="true"
  aria-label={UI_TEXT.LOADING_PRODUCTS}
>
  <CircularProgress />
</Box>
```

**Benefits:**
- Consistent ARIA roles across the application
- Easy to ensure accessibility best practices
- Centralized accessibility configuration

---

## Summary

The refactoring transformed a codebase with:
- ❌ Magic strings scattered everywhere
- ❌ Duplicated values across multiple files
- ❌ Hard to maintain and update
- ❌ Difficult to ensure consistency

Into a codebase with:
- ✅ Single source of truth for all constants
- ✅ Type-safe constants with autocomplete
- ✅ Easy to maintain and update
- ✅ Consistent values across the entire application
- ✅ Ready for internationalization
- ✅ Better developer experience

