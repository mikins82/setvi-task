import { useMemo, useRef, useEffect } from "react";
import { Box, CircularProgress } from "@mui/material";
import { useVirtualizer } from "@tanstack/react-virtual";
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

  const parentRef = useRef<HTMLDivElement>(null);

  // Flatten all pages into single array
  const allProducts = useMemo(
    () => data?.pages.flatMap((page) => page.products) || [],
    [data]
  );

  // Calculate total item count (add 1 for loader row if has more pages)
  const itemCount = hasNextPage ? allProducts.length + 1 : allProducts.length;

  // Create virtualizer
  const virtualizer = useVirtualizer({
    count: itemCount,
    getScrollElement: () => parentRef.current,
    estimateSize: () => 80, // Row height
    overscan: 5,
  });

  // Fetch more data when scrolling near the end
  useEffect(() => {
    const [lastItem] = [...virtualizer.getVirtualItems()].reverse();

    if (!lastItem) {
      return;
    }

    // Fetch next page when within 5 items of the end
    if (
      lastItem.index >= allProducts.length - 5 &&
      hasNextPage &&
      !isFetchingNextPage
    ) {
      fetchNextPage();
    }
  }, [
    hasNextPage,
    fetchNextPage,
    allProducts.length,
    isFetchingNextPage,
    virtualizer.getVirtualItems(),
  ]);

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
      <Box
        ref={parentRef}
        sx={{
          height: 600,
          overflow: "auto",
          contain: "strict",
        }}
      >
        <Box
          sx={{
            height: `${virtualizer.getTotalSize()}px`,
            width: "100%",
            position: "relative",
          }}
        >
          {virtualizer.getVirtualItems().map((virtualItem) => {
            const isLoaderRow = virtualItem.index >= allProducts.length;

            return (
              <Box
                key={virtualItem.key}
                sx={{
                  position: "absolute",
                  top: 0,
                  left: 0,
                  width: "100%",
                  height: `${virtualItem.size}px`,
                  transform: `translateY(${virtualItem.start}px)`,
                }}
              >
                {isLoaderRow ? (
                  <LoaderRow style={{}} />
                ) : (
                  <ProductRow
                    product={allProducts[virtualItem.index]}
                    style={{}}
                    onClick={() =>
                      onRowClick(allProducts[virtualItem.index].id)
                    }
                  />
                )}
              </Box>
            );
          })}
        </Box>
      </Box>
    </Box>
  );
};

