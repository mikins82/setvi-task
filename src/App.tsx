import { useState, useCallback, useEffect } from "react";
import { BrowserRouter } from "react-router-dom";
import { Container, Typography, Box, Stack } from "@mui/material";
import { useURLState } from "./hooks/useURLState";
import { useDebounce } from "./hooks/useDebounce";
import { SearchBar } from "./components/SearchFilters/SearchBar";
import { CategoryFilter } from "./components/SearchFilters/CategoryFilter";
import { ProductTable } from "./components/ProductTable/ProductTable";
import { ProductDrawer } from "./components/ProductDrawer/ProductDrawer";

function AppContent() {
  const { query, category, productId, page, updateQuery, updateCategory, updateProductId, updatePage } = useURLState();
  const [searchInput, setSearchInput] = useState(query);
  
  // Debounce the search query
  const debouncedQuery = useDebounce(searchInput, 300);

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
    <Container maxWidth="xl" sx={{ py: 4 }}>
      <Typography variant="h3" component="h1" gutterBottom sx={{ mb: 3 }}>
        Product Browser
      </Typography>

      {/* Search and Filters */}
      <Stack 
        direction={{ xs: "column", md: "row" }} 
        spacing={2} 
        sx={{ mb: 3 }}
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
      <ProductTable
        query={debouncedQuery}
        category={category}
        urlPage={page}
        onRowClick={handleRowClick}
        onPageChange={handlePageChange}
      />

      {/* Product Detail Drawer */}
      <ProductDrawer
        productId={productId}
        onClose={handleCloseDrawer}
      />
    </Container>
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
