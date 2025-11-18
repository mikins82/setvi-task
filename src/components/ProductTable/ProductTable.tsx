import { Box, CircularProgress } from "@mui/material";
import { useVirtualizer } from "@tanstack/react-virtual";
import { useEffect, useMemo, useRef } from "react";
import { useInfiniteProducts } from "../../hooks/useProducts";
import { EmptyState } from "../common/EmptyState";
import { ErrorState } from "../common/ErrorState";
import { LoaderRow } from "./LoaderRow";
import { ProductRow } from "./ProductRow";
import { TableHeader } from "./TableHeader";

interface ProductTableProps {
  query: string;
  category: string;
  urlPage: number;
  productId: string;
  onRowClick: (productId: number) => void;
  onPageChange: (page: number) => void;
}

export const ProductTable: React.FC<ProductTableProps> = ({
  query,
  category,
  urlPage,
  productId,
  onRowClick,
  onPageChange,
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
  const isRestoringFromURLRef = useRef(false);
  const targetScrollIndexRef = useRef<number | null>(null);
  const scrollOffsetRef = useRef<number>(0);

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
    estimateSize: () => 97, // Row height (matches actual rendered height)
    overscan: 5,
  });

  // Load pages from URL on initial mount
  useEffect(() => {
    if (!isLoading && urlPage > 1) {
      const currentPage = data?.pages.length || 0;

      // Continue loading if we haven't reached the target page yet
      if (currentPage < urlPage && hasNextPage && !isFetchingNextPage) {
        if (!isRestoringFromURLRef.current) {
          // First time - set the flag and target
          isRestoringFromURLRef.current = true;
          // Calculate target scroll position (middle of the last page)
          const targetIndex = (urlPage - 1) * 30 + 15; // Middle of the target page
          targetScrollIndexRef.current = targetIndex;
        }
        // Load next page (will trigger this effect again after state updates)
        fetchNextPage();
      }
    }
  }, [
    isLoading,
    urlPage,
    data?.pages.length,
    hasNextPage,
    isFetchingNextPage,
    fetchNextPage,
  ]);

  // Update URL page when data changes (user scrolled and loaded more)
  useEffect(() => {
    if (!isRestoringFromURLRef.current && data?.pages.length) {
      const currentPage = data.pages.length;
      if (currentPage !== urlPage) {
        onPageChange(currentPage);
      }
    }
  }, [data?.pages.length, urlPage, onPageChange]);

  // Restore scroll position after loading from URL
  useEffect(() => {
    if (
      targetScrollIndexRef.current !== null &&
      allProducts.length >= targetScrollIndexRef.current &&
      !isFetchingNextPage
    ) {
      const scrollIndex = targetScrollIndexRef.current;
      targetScrollIndexRef.current = null;
      isRestoringFromURLRef.current = false; // Done restoring

      // Use requestAnimationFrame to ensure DOM is updated
      requestAnimationFrame(() => {
        virtualizer.scrollToIndex(scrollIndex, {
          align: "center",
          behavior: "auto",
        });
      });
    }
  }, [allProducts.length, isFetchingNextPage, virtualizer]);

  // Fetch more data when scrolling near the end (normal infinite scroll)
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

  // Save and restore scroll position when drawer opens/closes
  useEffect(() => {
    if (productId) {
      // Drawer opened - save current scroll position
      scrollOffsetRef.current = parentRef.current?.scrollTop || 0;
    } else if (scrollOffsetRef.current > 0) {
      // Drawer closed - restore scroll position
      requestAnimationFrame(() => {
        if (parentRef.current) {
          parentRef.current.scrollTop = scrollOffsetRef.current;
        }
      });
    }
  }, [productId]);

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
    return (
      <EmptyState message="No products found. Try adjusting your search or filters." />
    );
  }

  return (
    <Box sx={{ border: 1, borderColor: "divider", borderRadius: 1 }}>
      <TableHeader />
      <Box
        ref={parentRef}
        sx={{
          height: "60vh",
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
                    productId={allProducts[virtualItem.index].id}
                    style={{}}
                    onRowClick={onRowClick}
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
