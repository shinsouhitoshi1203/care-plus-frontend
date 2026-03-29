import { QueryClient } from "@tanstack/react-query";

const tanstackClient = new QueryClient({
  // Not finished yet. Still in playground mode. More options will be added soon and it will be moved to a separate file.
  // defaultOptions: {
  //   queries: {
  //     gcTime: TANSTACK_QUERY_CACHE_TIME,
  //     staleTime: TANSTACK_QUERY_CACHE_TIME,
  //     retry: 1,
  //     retryDelay: 1000,
  //   },
  // },
});

export default tanstackClient;
