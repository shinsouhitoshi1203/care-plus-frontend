import { TANSTACK_QUERY_CACHE_TIME } from "@/stores/tanstack/config";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { AxiosError } from "axios";
import { useEffect } from "react";
import { Platform } from "react-native";
import { getPublicEmergencyInfo } from "../api";
import { EmergencyInfo } from "../types";
import usePublicURL from "./usePublicURL";

type EmergencyInfoQueryError = Error & {
  status?: number;
};

function isNotFoundError(error: unknown): boolean {
  if (error instanceof AxiosError) {
    return error.response?.status === 404;
  }

  if (error instanceof Error && "status" in error) {
    return (error as EmergencyInfoQueryError).status === 404;
  }

  return false;
}

export default function useEmergencyInfo(manualPublicID?: string) {
  // If manualPublicID is provided, use it; otherwise, try to get it from the public ID query
  const { id: publicIDFromQuery } = usePublicURL();

  const publicID = manualPublicID || publicIDFromQuery;

  const queryClient = useQueryClient();

  const { error, ...rest } = useQuery<EmergencyInfo, EmergencyInfoQueryError>({
    queryKey: ["emergency_public_info"],
    queryFn: async () => {
      if (!publicID) throw new Error("Missing public ID");
      return await getPublicEmergencyInfo(publicID);
    },
    enabled: Boolean(publicID),
    retry: 3,
    gcTime: TANSTACK_QUERY_CACHE_TIME, // 10 minutes
    staleTime: TANSTACK_QUERY_CACHE_TIME,
    meta: { persist: true },
    networkMode: "offlineFirst",
  });

  useEffect(() => {
    if (Platform.OS === "web") return; // Only run cache cleanup on native platforms

    if (isNotFoundError(error)) {
      queryClient.invalidateQueries({ queryKey: ["emergency_public_id"] });
      queryClient.invalidateQueries({ queryKey: ["emergency_public_info"] });
    }
  }, [queryClient, error, publicID]);

  useEffect(() => {
    if (!manualPublicID) {
      if (!publicIDFromQuery) {
        console.warn("No public ID provided and none found in query parameters.");
      } else {
        console.log("Using public ID from query parameters:", publicIDFromQuery);
      }
    }
  }, [manualPublicID, publicIDFromQuery]); // Just to silence React warning about missing dependencies

  return {
    error,
    ...rest,
  };
}
