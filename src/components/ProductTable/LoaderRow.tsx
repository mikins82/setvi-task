import { Box, CircularProgress, Typography } from "@mui/material";

interface LoaderRowProps {
  style: React.CSSProperties;
}

export const LoaderRow: React.FC<LoaderRowProps> = ({ style }) => {
  return (
    <Box
      style={style}
      sx={{
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: 4,
        borderBottom: 1,
        borderColor: "divider",
      }}
    >
      <CircularProgress size={24} sx={{ mr: 2 }} />
      <Typography variant="body2" color="text.secondary">
        Loading more products...
      </Typography>
    </Box>
  );
};

