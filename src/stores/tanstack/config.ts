const TANSTACK_QUERY_CACHE_TIME_HR = 24 * 7; // 1 hour

export const TANSTACK_QUERY_CACHE_TIME = TANSTACK_QUERY_CACHE_TIME_HR * 3600 * 1000; // in milliseconds

export const TANSTACK_QUERY_STALE_TIME = TANSTACK_QUERY_CACHE_TIME; // in milliseconds

export const TANSTACK_QUERY_RETRY = 1; // number of retry attempts for failed queries

export const TANSTACK_QUERY_RETRY_DELAY = 1000; // delay between retry attempts in milliseconds

export const TANSTACK_QUERY_CONFIG = {
  defaultOptions: {
    queries: {
      gcTime: TANSTACK_QUERY_CACHE_TIME,
      staleTime: TANSTACK_QUERY_STALE_TIME,
      retry: TANSTACK_QUERY_RETRY,
      retryDelay: TANSTACK_QUERY_RETRY_DELAY,
    },
  },
};
