import { useMemo, useCallback } from "react";
import { Box, CircularProgress } from "@mui/material";
import { List } from "react-window";
import { useInfiniteProducts } from "../../hooks/useProducts";
import { TableHeader } from "./TableHeader";
import { ProductRow } from "./ProductRow";
import { LoaderRow } from "./LoaderRow";
import { ErrorState } from "../common/ErrorState";
import { EmptyState } from "../common/EmptyState";

interface ProductTableProps {
  query: string;
  category: string;
  onRowClick: (productId: number) => void;
}

export const ProductTable: React.FC<ProductTableProps> = ({
  query,
  category,
  onRowClick,
}) => {
  const {
    data,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    isLoading,
    isError,
    refetch,
  } = useInfiniteProducts({ q: query, category });

  // Flatten all pages into single array
  const allProducts = useMemo(
    () => data?.pages.flatMap((page) => page.products) || [],
    [data]
  );

  const itemCount = hasNextPage ? allProducts.length + 1 : allProducts.length;

  // Handle infinite scroll
  const handleRowsRendered = useCallback(
    ({ startIndex, stopIndex }: { startIndex: number; stopIndex: number }) => {
      // If we're within 5 items of the end and not already fetching, fetch more
      if (!isFetchingNextPage && hasNextPage && stopIndex >= allProducts.length - 5) {
        fetchNextPage();
      }
    },
    [isFetchingNextPage, hasNextPage, allProducts.length, fetchNextPage]
  );

  // Row renderer component
  const RowComponent = ({
    index,
    style,
  }: {
    index: number;
    style: React.CSSProperties;
    ariaAttributes: {
      "aria-posinset": number;
      "aria-setsize": number;
      role: "listitem";
    };
  }) => {
    // Show loader row if we're past the loaded products
    if (index >= allProducts.length) {
      return <LoaderRow style={style} />;
    }

    const product = allProducts[index];
    return (
      <ProductRow
        key={product.id}
        product={product}
        style={style}
        onClick={() => onRowClick(product.id)}
      />
    );
  };

  if (isLoading) {
    return (
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          minHeight: 400,
        }}
      >
        <CircularProgress />
      </Box>
    );
  }

  if (isError) {
    return <ErrorState onRetry={refetch} />;
  }

  if (allProducts.length === 0) {
    return <EmptyState message="No products found. Try adjusting your search or filters." />;
  }

  return (
    <Box sx={{ border: 1, borderColor: "divider", borderRadius: 1 }}>
      <TableHeader />
      <List
        rowHeight={80}
        rowCount={itemCount}
        rowComponent={RowComponent}
        rowProps={{}}
        onRowsRendered={handleRowsRendered}
        defaultHeight={600}
      />
    </Box>
  );
};

