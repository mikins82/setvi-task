import React from "react";
import { Box, Typography } from "@mui/material";
import type { Product } from "../../api/types";
import { IMAGES, FORMATTING, SYMBOLS, A11Y, KEYBOARD } from "../../constants";

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
      if (e.key === KEYBOARD.ENTER || e.key === KEYBOARD.SPACE) {
        e.preventDefault();
        handleClick();
      }
    };

    return (
      <Box
        role={A11Y.ROLE.ROW}
        tabIndex={A11Y.TAB_INDEX_FOCUSABLE}
        style={style}
        onClick={handleClick}
        onKeyDown={handleKeyDown}
        aria-label={`${product.title}, ${product.category}, ${SYMBOLS.DOLLAR}${product.price.toFixed(FORMATTING.PRICE_DECIMALS)}, rated ${product.rating.toFixed(FORMATTING.RATING_DECIMALS)} stars. Press Enter to view details.`}
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
              width: IMAGES.THUMBNAIL_SIZE,
              height: IMAGES.THUMBNAIL_SIZE,
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
            {SYMBOLS.DOLLAR}{product.price.toFixed(FORMATTING.PRICE_DECIMALS)}
          </Typography>
        </Box>
        <Box sx={{ flex: 0.7, minWidth: 0, px: 2 }}>
          <Typography variant="body2">
            {SYMBOLS.STAR} {product.rating.toFixed(FORMATTING.RATING_DECIMALS)}
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

