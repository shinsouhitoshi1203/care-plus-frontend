import { useQuery } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import { getPublicEmergencyInfo } from "../api";
import { EmergencyInfo } from "../types";

export default function useEmergencyInfo(publicID: string) {
  const [isFetching, setIsFetching] = useState(false);
  const { refetch, isLoading, ...rest } = useQuery<EmergencyInfo, Error>({
    queryKey: ["emergency_public_info", publicID],
    queryFn: async () => {
      console.log("[QueryFn] Fetching emergency info for public ID:", publicID);
      if (!publicID) throw new Error("Missing public ID");
      return await getPublicEmergencyInfo(publicID);
    },
    enabled: !!publicID,
    retry: 3,
    staleTime: 5 * 60 * 1000,
  });

  useEffect(() => {
    if (publicID) {
      console.log("[useEffect] publicId changed, fetching:", publicID);
      setIsFetching(true);
      refetch().finally(() => {
        setIsFetching(false);
      });
    }
  }, [publicID, refetch]);

  // Log react query state changes
  // useEffect(() => {
  //   console.log("[Query State]", {
  //     data,
  //     isQueryLoading,
  //     isError,
  //     error: error?.message || null,
  //   });
  //   console.log("error object:", error);
  // }, [data, isQueryLoading, isError, error]);
  // const isLoading = isQueryLoading || isFetching;

  return {
    ...rest,
    isLoading: isLoading || isFetching,
    refetch,
  };
}
