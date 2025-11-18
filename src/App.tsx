import { useState, useCallback, useEffect } from "react";
import { BrowserRouter } from "react-router-dom";
import { Container, Typography, Box, Stack } from "@mui/material";
import { useURLState } from "./hooks/useURLState";
import { useDebounce } from "./hooks/useDebounce";
import { SearchBar } from "./components/SearchFilters/SearchBar";
import { CategoryFilter } from "./components/SearchFilters/CategoryFilter";
import { ProductTable } from "./components/ProductTable/ProductTable";
import { ProductDrawer } from "./components/ProductDrawer/ProductDrawer";
import { UI_TEXT, TIMING, A11Y } from "./constants";

function AppContent() {
  const { query, category, productId, page, updateQuery, updateCategory, updateProductId, updatePage } = useURLState();
  const [searchInput, setSearchInput] = useState<string>(query);
  
  // Debounce the search query
  const debouncedQuery = useDebounce(searchInput, TIMING.DEBOUNCE_DELAY);

  // Update URL when debounced query changes (not on every keystroke)
  useEffect(() => {
    if (debouncedQuery !== query) {
      updateQuery(debouncedQuery);
    }
  }, [debouncedQuery, query, updateQuery]);

  // Sync searchInput with URL query on mount or when URL changes externally
  useEffect(() => {
    if (query !== searchInput) {
      setSearchInput(query);
    }
  }, [query]);

  const handleSearchChange = (value: string) => {
    setSearchInput(value);
  };

  const handleCategoryChange = useCallback((cat: string) => {
    updateCategory(cat);
  }, [updateCategory]);

  const handleRowClick = useCallback((id: number) => {
    updateProductId(String(id));
  }, [updateProductId]);

  const handleCloseDrawer = useCallback(() => {
    updateProductId("");
  }, [updateProductId]);

  const handlePageChange = useCallback((pageNum: number) => {
    updatePage(pageNum);
  }, [updatePage]);

  return (
    <>
      {/* Skip Navigation Link for Screen Readers */}
      <a href={`#${UI_TEXT.MAIN_CONTENT_ID}`} className="skip-link">
        {UI_TEXT.SKIP_TO_CONTENT}
      </a>
      
      <Container maxWidth="xl" sx={{ py: 4 }}>
        <Typography variant="h3" component="h1" gutterBottom sx={{ mb: 3 }}>
          {UI_TEXT.APP_TITLE}
        </Typography>

        {/* Search and Filters */}
        <Stack 
          direction={{ xs: "column", md: "row" }} 
          spacing={2} 
          sx={{ mb: 3 }}
          role="search"
          aria-label={UI_TEXT.SEARCH_REGION_LABEL}
        >
          <Box sx={{ flex: { xs: "1 1 auto", md: "2 1 auto" } }}>
            <SearchBar
              value={searchInput}
              onChange={handleSearchChange}
              isLoading={searchInput !== debouncedQuery}
            />
          </Box>
          <Box sx={{ flex: { xs: "1 1 auto", md: "1 1 auto" } }}>
            <CategoryFilter
              value={category}
              onChange={handleCategoryChange}
            />
          </Box>
        </Stack>

        {/* Product Table */}
        <Box id={UI_TEXT.MAIN_CONTENT_ID} tabIndex={A11Y.TAB_INDEX_NOT_FOCUSABLE}>
          <ProductTable
            query={debouncedQuery}
            category={category}
            urlPage={page}
            productId={productId}
            onRowClick={handleRowClick}
            onPageChange={handlePageChange}
          />
        </Box>

        {/* Product Detail Drawer */}
        <ProductDrawer
          productId={productId}
          onClose={handleCloseDrawer}
        />
      </Container>
    </>
  );
}

function App() {
  return (
    <BrowserRouter>
      <AppContent />
    </BrowserRouter>
  );
}

export default App;
