import { Pagination } from "@/types/pagination";
import { useQueryClient, InfiniteData } from "@tanstack/react-query";
import { useCallback } from "react";

/**
 * Hook for handling query caching with infinite pagination
 *
 * @example
 * ```tsx
 * const { addItemOnScreen, updateItemOnScreen, removeItemFromScreen } = useQueryCache();
 *
 * // Add new item (coloca na primeira página)
 * addItemOnScreen(['adopters', searchTerm, filters], newAdopter);
 *
 * // Update item
 * updateItemOnScreen(['adopters', searchTerm, filters], updatedAdopter);
 *
 * // Remove item
 * removeItemFromScreen(['adopters', searchTerm, filters], adopterId);
 * ```
 */
export const useQueryCachePagination = () => {
  const queryClient = useQueryClient();

  /**
   * Adds a new item to the infinite query cache
   * By default, adds it to the BEGINNING of the first page
   *
   * @param cacheKey - Array wuth queryKey (ex: ['adopters', searchTerm, filters])
   * @param newItem - Item  to be added
   * @param appendToEnd - If true, add to the end of the first page; otherwise, add to the beginning.
   */
  const addItemOnScreen = useCallback(
    <T>(cacheKey: unknown[], newItem: T, appendToEnd = false) => {
      queryClient.setQueryData<InfiniteData<Pagination<T>>>(
        cacheKey,
        (oldData) => {
          if (!oldData) {
            return oldData;
          }

          if (!oldData.pages || oldData.pages.length === 0) {
            return oldData;
          }

          const firstPage = oldData.pages[0];

          if (!firstPage.items || !Array.isArray(firstPage.items)) {
            return oldData;
          }

          const updatedFirstPage: Pagination<T> = {
            ...firstPage,
            items: appendToEnd
              ? [...firstPage.items, newItem]
              : [newItem, ...firstPage.items],
            meta: {
              ...firstPage.meta,
              totalItems: firstPage.meta.totalItems + 1,
              itemCount: firstPage.items.length + 1,
            },
          };

          const updatedPages = [updatedFirstPage, ...oldData.pages.slice(1)];

          return {
            ...oldData,
            pages: updatedPages,
          };
        }
      );
    },
    [queryClient]
  );

  /**
   * Updates an existing item on any cached page
   * Searches for the item on all pages and replaces it when found
   *
   * @param cacheKey - Array with base queryKey (without consider filters)
   * @param data - Item updated (must contain the 'id' field)
   * @param conditionFn - Custom function to find the item (optional)
   */
  const updateItemOnScreen = useCallback(
    <T extends { id: string | number }>(
      cacheKey: unknown[],
      data: T,
      conditionFn?: (item: T, data: T) => boolean
    ) => {
      // setQueriesData updates ALL queries that match the filter
      // This is useful because ['adopters', 'joão', {...}] and ['adopters', '', {...}]
      // are different queries, but both need to be updated
      queryClient.setQueriesData<InfiniteData<Pagination<T>>>(
        { queryKey: cacheKey, exact: false },
        (oldData) => {
          if (!oldData || !oldData.pages) return oldData;

          const updatedPages = oldData.pages.map((page) => ({
            ...page,
            items: page.items.map((item) =>
              conditionFn
                ? conditionFn(item, data)
                  ? data
                  : item
                : item.id === data.id
                ? data
                : item
            ),
          }));

          return {
            ...oldData,
            pages: updatedPages,
          };
        }
      );
    },
    [queryClient]
  );

  /**
   * Removes an item from all pages in the cache.
   * Also updates the counters (totalItems).
   *
   * @param cacheKey - Array with base queryKey 
   * @param itemId - ID from removed item
   * @param conditionFn - Custom function to find the item (optional)
   */
  const removeItemFromScreen = useCallback(
    <T extends { id: string | number }>(
      cacheKey: unknown[],
      itemId: string | number,
      conditionFn?: (item: T) => boolean
    ) => {
      queryClient.setQueriesData<InfiniteData<Pagination<T>>>(
        { queryKey: cacheKey, exact: false },
        (oldData) => {
          if (!oldData || !oldData.pages) return oldData;

          let itemRemoved = false;

          const updatedPages = oldData.pages.map((page) => {
            const filteredItems = page.items.filter((item) => {
              const shouldRemove = conditionFn
                ? conditionFn(item)
                : item.id === itemId;

              if (shouldRemove) itemRemoved = true;
              return !shouldRemove;
            });

            return {
              ...page,
              items: filteredItems,
              meta: {
                ...page.meta,
                totalItems: itemRemoved
                  ? page.meta.totalItems - 1
                  : page.meta.totalItems,
                itemCount: filteredItems.length,
              },
            };
          });

          return {
            ...oldData,
            pages: updatedPages,
          };
        }
      );
    },
    [queryClient]
  );

  /**
  * Invalidates and redoes all queries that match the cacheKey.
  * Useful when you want to force a full refetch.
   *
   * @param cacheKey - Array with base queryKey 
   */
  const invalidateQueries = useCallback(
    (cacheKey: unknown[]) => {
      queryClient.invalidateQueries({
        queryKey: cacheKey,
        exact: false, 
      });
    },
    [queryClient]
  );

  /**
   * Re-run only the exact query (with specific filters)
   *
   * @param cacheKey - Array with the exact queryKey (including filters)
   */
  const refetchQuery = useCallback(
    (cacheKey: unknown[]) => {
      queryClient.refetchQueries({
        queryKey: cacheKey,
        exact: true,
      });
    },
    [queryClient]
  );

  return {
    addItemOnScreen,
    updateItemOnScreen,
    removeItemFromScreen,
    invalidateQueries,
    refetchQuery,
  };
};
