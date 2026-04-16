import { useQueryClient } from "@tanstack/react-query";
import { useCallback } from "react";

export default function useReset() {
  const queryClient = useQueryClient();
  const _ = useCallback(() => {
    queryClient.removeQueries({ queryKey: ["user"] });
    queryClient.removeQueries({ queryKey: ["family.info"] });
  }, [queryClient]);
  return _;
}
