import { useQueryClient } from "@tanstack/react-query";
import { useCallback } from "react";

type CacheItems<T> = {
  items: T[];
  meta: { totalItems: number };
};

export const useQueryCache = () => {
  const queryClient = useQueryClient();

  const addItemOnScreen = useCallback(
    <T>(cacheKey: unknown[], newItem: T, appendToEnd = false) => {
      queryClient.setQueryData<CacheItems<T>>(cacheKey, (oldData) => {
        if (!oldData) return oldData;

        return {
          ...oldData,
          items: appendToEnd
            ? [...oldData.items, newItem]
            : [newItem, ...oldData.items],
          meta: {
            totalItems: oldData.meta.totalItems + 1,
          },
        };
      });
    },
    [queryClient]
  );

  const updateItemOnScreen = useCallback(
    <T extends { id: string | number }>(
      cacheKey: unknown[],
      data: T,
      conditionFn?: (item: T, data: T) => boolean
    ) => {
      queryClient.setQueriesData<CacheItems<T>>(
        { queryKey: cacheKey },
        (oldData) => {
          if (!oldData) return oldData;

          return {
            ...oldData,
            items: oldData.items.map((item) =>
              conditionFn
                ? conditionFn(item, data)
                  ? data
                  : item
                : item.id === data.id
                ? data
                : item
            ),
          };
        }
      );
    },
    [queryClient]
  );

  const removeItemFromScreen = useCallback(
    <T extends { id: string | number }>(
      cacheKey: unknown[],
      itemId: string | number,
      conditionFn?: (item: T) => boolean
    ) => {
      queryClient.setQueriesData<CacheItems<T>>(
        { queryKey: cacheKey, exact: false },
        (oldData) => {
          if (!oldData) return oldData;

          return {
            ...oldData,
            items: oldData.items.filter((item) =>
              conditionFn ? !conditionFn(item) : item.id !== itemId
            ),
            meta: {
              totalItems: oldData.meta.totalItems - 1,
            },
          };
        }
      );
    },
    [queryClient]
  );

  return { addItemOnScreen, updateItemOnScreen, removeItemFromScreen };
};

//   const overrideCache = useCallback(
//     <Cache>(cacheName: string, newCache: Cache) => {
//       queryClient.setQueryData<Cache>(cacheName, newCache);
//     },
//     [queryClient],
//   );

//   const clearCache = useCallback(
//     (cacheName: string) => {
//       queryClient.setQueryData(cacheName, null);
//     },
//     [queryClient],
//   );

//   return {
//     addItemOnScreen,
//     // updateItemOnScreen,
//     // removeItemFromScreen,
//     // overrideCache,
//     // clearCache,
//   };
// };
