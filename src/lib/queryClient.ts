import { QueryClient } from "@tanstack/react-query";

const queryClient = new QueryClient({
  // defaultOptions: {
  //   queries: {
  //     retry: 1,
  //     refetchOnWindowFocus: false,
  //   },
  // },
  defaultOptions: {
    queries: {
      staleTime: Infinity,
      refetchOnWindowFocus: false,
      retry: false,
    },
  },
});
export default queryClient;
