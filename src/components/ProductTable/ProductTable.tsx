import { Box, CircularProgress } from "@mui/material";
import { useVirtualizer } from "@tanstack/react-virtual";
import { useEffect, useMemo, useRef } from "react";
import { useInfiniteProducts } from "../../hooks/useProducts";
import { EmptyState } from "../common/EmptyState";
import { ErrorState } from "../common/ErrorState";
import { LoaderRow } from "./LoaderRow";
import { ProductRow } from "./ProductRow";
import { TableHeader } from "./TableHeader";
import { VIRTUALIZATION, PAGINATION, UI_TEXT, A11Y, LAYOUT } from "../../constants";

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
  const restorationAttemptsRef = useRef<number>(0);

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
    estimateSize: () => VIRTUALIZATION.ROW_HEIGHT,
    overscan: VIRTUALIZATION.OVERSCAN,
  });

  // Load pages from URL on initial mount
  useEffect(() => {
    if (!isLoading && urlPage > 1) {
      const currentPage = data?.pages.length || 0;
      const totalProducts = data?.pages[0]?.total || 0;

      // Calculate max possible pages based on total products
      const maxPossiblePages = Math.ceil(totalProducts / PAGINATION.ITEMS_PER_PAGE);
      const targetPage = Math.min(urlPage, maxPossiblePages);

      // Continue loading if we haven't reached the target page yet
      if (currentPage < targetPage && hasNextPage && !isFetchingNextPage) {
        if (!isRestoringFromURLRef.current) {
          // First time - set the flag and target
          isRestoringFromURLRef.current = true;
          restorationAttemptsRef.current = 0;
          
          // Calculate safe target index (clamped to total products)
          const idealIndex = (targetPage - 1) * PAGINATION.ITEMS_PER_PAGE + VIRTUALIZATION.URL_RESTORE_MIDDLE_OFFSET;
          const maxSafeIndex = totalProducts > 0 ? Math.min(idealIndex, totalProducts - 1) : idealIndex;
          targetScrollIndexRef.current = maxSafeIndex;
        }

        // Safety valve: stop after too many attempts
        restorationAttemptsRef.current++;
        if (restorationAttemptsRef.current > VIRTUALIZATION.MAX_RESTORATION_ATTEMPTS) {
          console.warn('URL restoration exceeded max attempts, aborting');
          targetScrollIndexRef.current = null;
          isRestoringFromURLRef.current = false;
          return;
        }

        // Load next page (will trigger this effect again after state updates)
        fetchNextPage();
      } else if (currentPage >= targetPage || !hasNextPage) {
        // We've loaded enough OR there are no more pages
        // Restore to best position we have
        if (isRestoringFromURLRef.current && targetScrollIndexRef.current !== null) {
          const safeScrollIndex = Math.max(0, Math.min(
            targetScrollIndexRef.current,
            allProducts.length - 1
          ));
          
          if (safeScrollIndex >= 0 && allProducts.length > 0) {
            requestAnimationFrame(() => {
              virtualizer.scrollToIndex(safeScrollIndex, {
                align: "center",
                behavior: "auto",
              });
            });
          }
          
          targetScrollIndexRef.current = null;
          isRestoringFromURLRef.current = false;
        }
      }
    }
  }, [
    isLoading,
    urlPage,
    data?.pages,
    hasNextPage,
    isFetchingNextPage,
    fetchNextPage,
    allProducts.length,
    virtualizer,
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

  // Restore scroll position after loading from URL (fallback mechanism)
  useEffect(() => {
    if (
      targetScrollIndexRef.current !== null &&
      !isFetchingNextPage
    ) {
      // Check if we have enough products OR we know we can't get more
      const hasEnoughProducts = allProducts.length >= targetScrollIndexRef.current;
      const canLoadMore = hasNextPage;
      
      if (hasEnoughProducts || !canLoadMore) {
        // Clamp scroll index to valid range [0, allProducts.length - 1]
        const scrollIndex = Math.max(0, Math.min(
          targetScrollIndexRef.current,
          allProducts.length - 1
        ));
        
        targetScrollIndexRef.current = null;
        isRestoringFromURLRef.current = false; // Done restoring

        // Use requestAnimationFrame to ensure DOM is updated
        if (scrollIndex >= 0 && allProducts.length > 0) {
          requestAnimationFrame(() => {
            virtualizer.scrollToIndex(scrollIndex, {
              align: "center",
              behavior: "auto",
            });
          });
        }
      }
    }
  }, [allProducts.length, isFetchingNextPage, hasNextPage, virtualizer]);

  // Fetch more data when scrolling near the end (normal infinite scroll)
  useEffect(() => {
    const [lastItem] = [...virtualizer.getVirtualItems()].reverse();

    if (!lastItem) {
      return;
    }

    // Fetch next page when within threshold items of the end
    if (
      lastItem.index >= allProducts.length - VIRTUALIZATION.FETCH_THRESHOLD &&
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
        role={A11Y.ROLE.STATUS}
        aria-live={A11Y.ARIA_LIVE.POLITE}
        aria-busy="true"
        aria-label={UI_TEXT.LOADING_PRODUCTS}
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          minHeight: LAYOUT.LOADING_STATE_MIN_HEIGHT,
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
      <EmptyState message={UI_TEXT.NO_PRODUCTS_WITH_FILTERS} />
    );
  }

  return (
    <Box 
      sx={{ border: 1, borderColor: "divider", borderRadius: 1 }}
      role={A11Y.ROLE.REGION}
      aria-label={UI_TEXT.PRODUCT_LIST_LABEL}
      aria-busy={isFetchingNextPage}
    >
      <TableHeader />
      <Box
        ref={parentRef}
        sx={{
          height: LAYOUT.TABLE_HEIGHT,
          overflow: "auto",
          contain: "strict",
        }}
        role={A11Y.ROLE.TABLE}
        aria-label={UI_TEXT.PRODUCTS_TABLE_LABEL}
        aria-rowcount={itemCount}
      >
        <Box
          sx={{
            height: `${virtualizer.getTotalSize()}px`,
            width: "100%",
            position: "relative",
          }}
          role={A11Y.ROLE.ROWGROUP}
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
