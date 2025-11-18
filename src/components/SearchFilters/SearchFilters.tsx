import { Stack, Box } from "@mui/material";
import { SearchBar } from "./SearchBar";
import { CategoryFilter } from "./CategoryFilter";
import { UI_TEXT } from "../../constants";

interface SearchFiltersProps {
  searchValue: string;
  categoryValue: string;
  isSearching: boolean;
  onSearchChange: (value: string) => void;
  onCategoryChange: (category: string) => void;
}

export function SearchFilters({
  searchValue,
  categoryValue,
  isSearching,
  onSearchChange,
  onCategoryChange,
}: SearchFiltersProps) {
  return (
    <Stack
      direction={{ xs: "column", md: "row" }}
      spacing={2}
      sx={{ mb: 3 }}
      role="search"
      aria-label={UI_TEXT.SEARCH_REGION_LABEL}
    >
      <Box sx={{ flex: { xs: "1 1 auto", md: "2 1 auto" } }}>
        <SearchBar
          value={searchValue}
          onChange={onSearchChange}
          isLoading={isSearching}
        />
      </Box>
      <Box sx={{ flex: { xs: "1 1 auto", md: "1 1 auto" } }}>
        <CategoryFilter
          value={categoryValue}
          onChange={onCategoryChange}
        />
      </Box>
    </Stack>
  );
}

