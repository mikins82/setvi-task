import { useEffect } from "react";
import {
  Drawer,
  Box,
  IconButton,
  Typography,
  Divider,
  Chip,
  CircularProgress,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import { useQuery } from "@tanstack/react-query";
import { fetchProductById } from "../../api/products";
import { AISummary } from "./AISummary";
import { UI_TEXT, KEYBOARD, A11Y, LAYOUT, IMAGES, FORMATTING, SYMBOLS, QUERY_KEYS } from "../../constants";

interface ProductDrawerProps {
  productId: string | null;
  onClose: () => void;
}

export const ProductDrawer: React.FC<ProductDrawerProps> = ({
  productId,
  onClose,
}) => {
  const { data: product, isLoading } = useQuery({
    queryKey: [QUERY_KEYS.PRODUCT, productId],
    queryFn: () => fetchProductById(productId!),
    enabled: !!productId,
  });

  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === KEYBOARD.ESCAPE) onClose();
    };
    window.addEventListener("keydown", handleEscape);
    return () => window.removeEventListener("keydown", handleEscape);
  }, [onClose]);

  return (
    <Drawer 
      anchor="right" 
      open={!!productId} 
      onClose={onClose}
      role={A11Y.ROLE.DIALOG}
      aria-modal="true"
      aria-labelledby={UI_TEXT.DRAWER_TITLE_ID}
    >
      <Box sx={{ width: { xs: LAYOUT.DRAWER_WIDTH_MOBILE, sm: LAYOUT.DRAWER_WIDTH_DESKTOP }, p: LAYOUT.PRODUCT_DRAWER_PADDING }}>
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            mb: 2,
          }}
        >
          <Typography variant="h5" component="h2" id={UI_TEXT.DRAWER_TITLE_ID}>
            {UI_TEXT.PRODUCT_DETAILS}
          </Typography>
          <IconButton onClick={onClose} aria-label={UI_TEXT.CLOSE_DRAWER}>
            <CloseIcon />
          </IconButton>
        </Box>

        <Divider sx={{ mb: 3 }} />

        {isLoading ? (
          <Box
            sx={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              minHeight: 200,
            }}
          >
            <CircularProgress />
          </Box>
        ) : product ? (
          <Box>
            {/* Product Images */}
            {product.images && product.images.length > 0 && (
              <Box sx={{ display: "flex", flexWrap: "wrap", gap: 1, mb: 3 }}>
                {product.images.slice(0, IMAGES.MAX_DRAWER_IMAGES).map((image, index) => (
                  <Box key={index} sx={{ width: "calc(50% - 4px)" }}>
                    <Box
                      component="img"
                      src={image}
                      alt={`${product.title} ${index + 1}`}
                      sx={{
                        width: "100%",
                        height: IMAGES.DRAWER_IMAGE_HEIGHT,
                        objectFit: "cover",
                        borderRadius: 1,
                      }}
                    />
                  </Box>
                ))}
              </Box>
            )}

            {/* Product Title */}
            <Typography variant="h6" gutterBottom>
              {product.title}
            </Typography>

            {/* Brand */}
            {product.brand && (
              <Typography variant="body2" color="text.secondary" gutterBottom>
                {UI_TEXT.BRAND_PREFIX}{product.brand}
              </Typography>
            )}

            {/* Price and Rating */}
            <Box sx={{ display: "flex", gap: 2, my: 2 }}>
              <Typography variant="h5" color="primary">
                {SYMBOLS.DOLLAR}{product.price.toFixed(FORMATTING.PRICE_DECIMALS)}
              </Typography>
              <Typography variant="h6" color="text.secondary">
                {SYMBOLS.STAR} {product.rating.toFixed(FORMATTING.RATING_DECIMALS)}
              </Typography>
            </Box>

            {/* Category */}
            <Box sx={{ mb: 2 }}>
              <Chip label={product.category} color="primary" variant="outlined" />
            </Box>

            {/* Stock */}
            {product.stock !== undefined && (
              <Typography variant="body2" color="text.secondary" gutterBottom>
                {UI_TEXT.STOCK_PREFIX}{product.stock}{UI_TEXT.STOCK_UNITS}
              </Typography>
            )}

            {/* Description */}
            <Typography variant="body1" paragraph sx={{ mt: 2 }}>
              {product.description}
            </Typography>

            {/* Tags */}
            {product.tags && product.tags.length > 0 && (
              <Box sx={{ mt: 2 }}>
                <Typography variant="subtitle2" gutterBottom>
                  {UI_TEXT.TAGS_LABEL}
                </Typography>
                <Box sx={{ display: "flex", flexWrap: "wrap", gap: 1 }}>
                  {product.tags.map((tag) => (
                    <Chip key={tag} label={tag} size="small" />
                  ))}
                </Box>
              </Box>
            )}

            <Divider sx={{ my: 3 }} />

            {/* AI Summary */}
            <AISummary productId={product.id} />
          </Box>
        ) : null}
      </Box>
    </Drawer>
  );
};

