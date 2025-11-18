import { Box, Typography } from "@mui/material";
import { UI_TEXT, A11Y } from "../../constants";

export const TableHeader: React.FC = () => {
  return (
    <Box
      role={A11Y.ROLE.ROW}
      sx={{
        display: "flex",
        alignItems: "center",
        fontWeight: "bold",
        bgcolor: "grey.100",
        padding: 2,
        borderBottom: 2,
        borderColor: "divider",
        position: "sticky",
        top: 0,
        zIndex: 1,
      }}
    >
      <Box sx={{ width: 80, flexShrink: 0 }}>
        <Typography variant="subtitle2" fontWeight="bold">
          {UI_TEXT.TABLE_HEADER_THUMBNAIL}
        </Typography>
      </Box>
      <Box sx={{ flex: 2, minWidth: 0, px: 2 }}>
        <Typography variant="subtitle2" fontWeight="bold">
          {UI_TEXT.TABLE_HEADER_TITLE}
        </Typography>
      </Box>
      <Box sx={{ flex: 1, minWidth: 0, px: 2 }}>
        <Typography variant="subtitle2" fontWeight="bold">
          {UI_TEXT.TABLE_HEADER_CATEGORY}
        </Typography>
      </Box>
      <Box sx={{ flex: 0.7, minWidth: 0, px: 2 }}>
        <Typography variant="subtitle2" fontWeight="bold">
          {UI_TEXT.TABLE_HEADER_PRICE}
        </Typography>
      </Box>
      <Box sx={{ flex: 0.7, minWidth: 0, px: 2 }}>
        <Typography variant="subtitle2" fontWeight="bold">
          {UI_TEXT.TABLE_HEADER_RATING}
        </Typography>
      </Box>
    </Box>
  );
};

