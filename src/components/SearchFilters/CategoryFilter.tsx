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
          Loading categories...
        </Typography>
      </Box>
    );
  }

  if (isError) {
    return null;
  }

  return (
    <FormControl fullWidth>
      <InputLabel id="category-filter-label">Category</InputLabel>
      <Select
        labelId="category-filter-label"
        id="category-filter"
        value={value}
        label="Category"
        onChange={(e) => onChange(e.target.value)}
        aria-label="Filter by category"
      >
        <MenuItem value="">
          <em>All Categories</em>
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

