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

  return { addItemOnScreen, updateItemOnScreen };
};

//   const updateItemOnScreen = useCallback(
//     <Cache extends C>(
//       cacheName: string,
//       data: Cache['items'][number],
//       conditionFn?: (
//         item: Cache['items'][number],
//         data: Cache['items'][number],
//       ) => boolean,
//     ) => {
//       queryClient.setQueryData<Cache>(cacheName, (previousCache) => {
//         if (previousCache) {
//           const updatedCache: Cache = {
//             ...previousCache,
//             items: previousCache.items.map((item) => {
//               if (conditionFn ? conditionFn(item, data) : item.id === data.id) {
//                 item = data;
//               }

//               return item;
//             }),
//           };

//           return updatedCache;
//         }

//         return previousCache!;
//       });
//     },
//     [queryClient],
//   );

//   const removeItemFromScreen = useCallback(
//     <Cache extends C>(
//       cacheName: string,
//       itemId: number | null,
//       conditionFn?: (item: Cache['items'][number]) => boolean,
//     ) => {
//       queryClient.setQueryData<Cache>(cacheName, (previousCache) => {
//         if (previousCache) {
//           const filteredCache = previousCache?.items.filter((item) =>
//             conditionFn ? conditionFn(item) : item.id !== itemId,
//           );

//           return {
//             ...previousCache,
//             items: filteredCache,
//             meta: {
//               totalItems: previousCache.meta.totalItems - 1,
//             },
//           };
//         }

//         return previousCache!;
//       });
//     },
//     [queryClient],
//   );

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
