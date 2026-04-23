import { removeTanstackPersistedCache } from "@/stores/tanstack";
import { useQueryClient } from "@tanstack/react-query";
import { useCallback } from "react";

type ResetOptions = {
  clearPersistence?: boolean;
};

export default function useReset() {
  const queryClient = useQueryClient();

  const reset = useCallback(
    async (options: ResetOptions = {}) => {
      const { clearPersistence = false } = options;

      queryClient.removeQueries();
      if (clearPersistence) {
        await removeTanstackPersistedCache();
      }
    },
    [queryClient]
  );

  return reset;
}
