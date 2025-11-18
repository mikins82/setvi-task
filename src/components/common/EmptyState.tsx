import { Box, Typography, Button } from "@mui/material";
import SearchOffIcon from "@mui/icons-material/SearchOff";
import { UI_TEXT, LAYOUT } from "../../constants";

interface EmptyStateProps {
  message?: string;
  action?: {
    label: string;
    onClick: () => void;
  };
}

export const EmptyState: React.FC<EmptyStateProps> = ({
  message = UI_TEXT.NO_PRODUCTS_FOUND,
  action,
}) => {
  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        padding: LAYOUT.EMPTY_STATE_PADDING,
        textAlign: "center",
      }}
    >
      <SearchOffIcon sx={{ fontSize: 64, color: "text.secondary", mb: 2 }} />
      <Typography variant="h6" color="text.secondary">
        {message}
      </Typography>
      {action && (
        <Button variant="outlined" onClick={action.onClick} sx={{ mt: 2 }}>
          {action.label}
        </Button>
      )}
    </Box>
  );
};

