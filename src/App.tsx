import { Box, Container } from "@mui/material";
import { useCallback, useEffect, useState } from "react";
import { BrowserRouter } from "react-router-dom";
import { Header } from "./components/common/Header";
import { SkipLink } from "./components/common/SkipLink";
import { ProductDrawer } from "./components/ProductDrawer/ProductDrawer";
import { ProductTable } from "./components/ProductTable/ProductTable";
import { SearchFilters } from "./components/SearchFilters/SearchFilters";
import { A11Y, TIMING, UI_TEXT } from "./constants";
import { useDebounce } from "./hooks/useDebounce";
import { useURLState } from "./hooks/useURLState";

function AppContent() {
  const {
    query,
    category,
    productId,
    page,
    updateQuery,
    updateCategory,
    updateProductId,
    updatePage,
  } = useURLState();
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

  const handleCategoryChange = useCallback(
    (cat: string) => {
      updateCategory(cat);
    },
    [updateCategory]
  );

  const handleRowClick = useCallback(
    (id: number) => {
      updateProductId(String(id));
    },
    [updateProductId]
  );

  const handleCloseDrawer = useCallback(() => {
    updateProductId("");
  }, [updateProductId]);

  const handlePageChange = useCallback(
    (pageNum: number) => {
      updatePage(pageNum);
    },
    [updatePage]
  );

  return (
    <>
      {/* Skip Navigation Link for Screen Readers */}
      <SkipLink
        targetId={UI_TEXT.MAIN_CONTENT_ID}
        label={UI_TEXT.SKIP_TO_CONTENT}
      />

      <Container maxWidth="xl" sx={{ py: 4 }}>
        <Header title={UI_TEXT.APP_TITLE} />

        {/* Search and Filters */}
        <SearchFilters
          searchValue={searchInput}
          categoryValue={category}
          isSearching={searchInput !== debouncedQuery}
          onSearchChange={handleSearchChange}
          onCategoryChange={handleCategoryChange}
        />

        {/* Product Table */}
        <Box
          id={UI_TEXT.MAIN_CONTENT_ID}
          tabIndex={A11Y.TAB_INDEX_NOT_FOCUSABLE}
        >
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
        <ProductDrawer productId={productId} onClose={handleCloseDrawer} />
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
