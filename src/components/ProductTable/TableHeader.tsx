import { Box, Typography } from "@mui/material";

export const TableHeader: React.FC = () => {
  return (
    <Box
      role="row"
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
          Thumbnail
        </Typography>
      </Box>
      <Box sx={{ width: 300, flexShrink: 0, px: 2 }}>
        <Typography variant="subtitle2" fontWeight="bold">
          Title
        </Typography>
      </Box>
      <Box sx={{ width: 150, flexShrink: 0, px: 2 }}>
        <Typography variant="subtitle2" fontWeight="bold">
          Category
        </Typography>
      </Box>
      <Box sx={{ width: 100, flexShrink: 0, px: 2 }}>
        <Typography variant="subtitle2" fontWeight="bold">
          Price
        </Typography>
      </Box>
      <Box sx={{ width: 100, flexShrink: 0, px: 2 }}>
        <Typography variant="subtitle2" fontWeight="bold">
          Rating
        </Typography>
      </Box>
    </Box>
  );
};

