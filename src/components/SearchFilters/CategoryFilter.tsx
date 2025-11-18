import {
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  CircularProgress,
  Box,
  Typography,
} from "@mui/material";
import { useCategories } from "../../hooks/useCategories";
import { UI_TEXT } from "../../constants";

interface CategoryFilterProps {
  value: string;
  onChange: (category: string) => void;
}

export const CategoryFilter: React.FC<CategoryFilterProps> = ({
  value,
  onChange,
}) => {
  const { data: categories, isLoading, isError } = useCategories();

  if (isLoading) {
    return (
      <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
        <CircularProgress size={20} />
        <Typography variant="body2" color="text.secondary">
          {UI_TEXT.LOADING_CATEGORIES}
        </Typography>
      </Box>
    );
  }

  if (isError) {
    return null;
  }

  return (
    <FormControl fullWidth>
      <InputLabel id="category-filter-label">{UI_TEXT.FILTER_CATEGORY_LABEL}</InputLabel>
      <Select
        labelId="category-filter-label"
        id="category-filter"
        value={value}
        label={UI_TEXT.FILTER_CATEGORY_LABEL}
        onChange={(e) => onChange(e.target.value)}
        aria-label={UI_TEXT.FILTER_BY_CATEGORY}
      >
        <MenuItem value="">
          <em>{UI_TEXT.ALL_CATEGORIES}</em>
        </MenuItem>
        {categories?.map((category) => (
          <MenuItem key={category.slug} value={category.slug}>
            {category.name}
          </MenuItem>
        ))}
      </Select>
    </FormControl>
  );
};

