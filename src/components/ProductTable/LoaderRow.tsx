import { Box, CircularProgress, Typography } from "@mui/material";
import { UI_TEXT, A11Y } from "../../constants";

interface LoaderRowProps {
  style: React.CSSProperties;
}

export const LoaderRow: React.FC<LoaderRowProps> = ({ style }) => {
  return (
    <Box
      style={style}
      role={A11Y.ROLE.STATUS}
      aria-live={A11Y.ARIA_LIVE.POLITE}
      aria-label={UI_TEXT.LOADING_MORE_PRODUCTS_LABEL}
      sx={{
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: 4,
        borderBottom: 1,
        borderColor: "divider",
      }}
    >
      <CircularProgress size={24} sx={{ mr: 2 }} aria-hidden="true" />
      <Typography variant="body2" color="text.secondary">
        {UI_TEXT.LOADING_MORE_PRODUCTS}
      </Typography>
    </Box>
  );
};

