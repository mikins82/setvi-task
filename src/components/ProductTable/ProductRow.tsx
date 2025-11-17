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
          <img
            src={product.thumbnail}
            alt={product.title}
            style={{
              width: 60,
              height: 60,
              objectFit: "cover",
              borderRadius: 4,
            }}
            loading="lazy"
          />
        </Box>
        <Box sx={{ width: 300, flexShrink: 0, px: 2 }}>
          <Typography variant="body2" noWrap>
            {product.title}
          </Typography>
        </Box>
        <Box sx={{ width: 150, flexShrink: 0, px: 2 }}>
          <Typography variant="body2" color="text.secondary" noWrap>
            {product.category}
          </Typography>
        </Box>
        <Box sx={{ width: 100, flexShrink: 0, px: 2 }}>
          <Typography variant="body2" fontWeight="medium">
            ${product.price.toFixed(2)}
          </Typography>
        </Box>
        <Box sx={{ width: 100, flexShrink: 0, px: 2 }}>
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

