import CloseIcon from "@mui/icons-material/Close";
import SearchIcon from "@mui/icons-material/Search";
import {
  CircularProgress,
  IconButton,
  InputAdornment,
  TextField,
} from "@mui/material";
import { A11Y, UI_TEXT } from "../../constants";

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
  const handleClear = () => {
    onChange("");
  };

  return (
    <TextField
      fullWidth
      value={value}
      onChange={(e) => onChange(e.target.value)}
      placeholder={UI_TEXT.SEARCH_PLACEHOLDER}
      variant="outlined"
      size="medium"
      aria-label={UI_TEXT.SEARCH_ARIA_LABEL}
      role={A11Y.ROLE.SEARCHBOX}
      InputProps={{
        startAdornment: (
          <InputAdornment position="start">
            <SearchIcon color="action" />
          </InputAdornment>
        ),
        endAdornment: (
          <InputAdornment position="end">
            {isLoading && <CircularProgress size={20} />}
            {value && !isLoading && (
              <IconButton
                size="small"
                onClick={handleClear}
                aria-label={UI_TEXT.CLEAR_SEARCH}
              >
                <CloseIcon />
              </IconButton>
            )}
          </InputAdornment>
        ),
      }}
    />
  );
};
