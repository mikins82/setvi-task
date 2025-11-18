import React from "react";
import { Box, Typography } from "@mui/material";
import type { Product } from "../../api/types";

interface ProductRowProps {
  product: Product;
  productId: number;
  style: React.CSSProperties;
  onRowClick: (id: number) => void;
}

export const ProductRow: React.FC<ProductRowProps> = React.memo(
  ({ product, productId, style, onRowClick }) => {
    const handleClick = () => onRowClick(productId);
    
    const handleKeyDown = (e: React.KeyboardEvent) => {
      if (e.key === "Enter" || e.key === " ") {
        e.preventDefault();
        handleClick();
      }
    };

    return (
      <Box
        role="row"
        tabIndex={0}
        style={style}
        onClick={handleClick}
        onKeyDown={handleKeyDown}
        aria-label={`${product.title}, ${product.category}, $${product.price.toFixed(2)}, rated ${product.rating.toFixed(1)} stars. Press Enter to view details.`}
        sx={{
          display: "flex",
          alignItems: "center",
          cursor: "pointer",
          borderBottom: 1,
          borderColor: "divider",
          padding: 2,
          "&:hover": {
            bgcolor: "action.hover",
          },
          "&:focus": {
            bgcolor: "action.hover",
            outline: "none",
          },
        }}
      >
        <Box sx={{ width: 80, flexShrink: 0 }}>
          <Box
            component="img"
            src={product.thumbnail}
            alt={product.title}
            loading="lazy"
            sx={{
              width: 60,
              height: 60,
              objectFit: "cover",
              borderRadius: 1,
            }}
          />
        </Box>
        <Box sx={{ flex: 2, minWidth: 0, px: 2 }}>
          <Typography variant="body2" noWrap>
            {product.title}
          </Typography>
        </Box>
        <Box sx={{ flex: 1, minWidth: 0, px: 2 }}>
          <Typography variant="body2" color="text.secondary" noWrap>
            {product.category}
          </Typography>
        </Box>
        <Box sx={{ flex: 0.7, minWidth: 0, px: 2 }}>
          <Typography variant="body2" fontWeight="medium">
            ${product.price.toFixed(2)}
          </Typography>
        </Box>
        <Box sx={{ flex: 0.7, minWidth: 0, px: 2 }}>
          <Typography variant="body2">
            ⭐ {product.rating.toFixed(1)}
          </Typography>
        </Box>
      </Box>
    );
  },
  (prevProps, nextProps) => {
    return prevProps.product.id === nextProps.product.id;
  }
);

ProductRow.displayName = "ProductRow";

