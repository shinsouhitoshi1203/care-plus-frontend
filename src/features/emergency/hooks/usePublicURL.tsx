import apiClient from "@/config/axios";
import env from "@/config/env";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { AxiosError } from "axios";
import { useEffect } from "react";
import { getPublicEmergencyInfo } from "../api";

export default function usePublicURL() {
  const queryClient = useQueryClient();
  const {
    error,
    data: qr,
    isError,
    refetch,
    isLoading,
    isFetching,
  } = useQuery({
    queryKey: ["emergency_public_id"],
    queryFn: async () => {
      const url = (await apiClient.get("/users/emergency-info/qr")).data.data;

      console.log("Fetched public URL:", url.publicId);
      return url.publicId;
    },
    select: (id) => {
      if (!id) return null;
      return {
        id: id,
        qrURL: `${env.baseWEB}/emergency/?id=${id}`,
      };
    },
    retry: 3,
    staleTime: 15 * 60 * 1000, // 5 minutes
    // networkMode: offlineFirst ? "offlineFirst" : "online",
    // meta: { persist: offlineFirst },
  });

  useEffect(() => {
    if (qr?.id) {
      // console.log("Prefetching emergency info for public ID:", data.id);
      // Fetch trước, để một hổi có gì thì đã có data rồi, không phải đợi load lại từ đầu
      const emergencyPublicID = qr.id;

      void queryClient.prefetchQuery({
        queryKey: ["emergency_public_info"],
        queryFn: async () => await getPublicEmergencyInfo(emergencyPublicID),
        staleTime: 15 * 60 * 1000, // 5 minutes
        networkMode: "offlineFirst",
        meta: { persist: true },
      });
    } else {
      void refetch();
      queryClient.removeQueries({ queryKey: ["emergency_public_id"] });
      queryClient.removeQueries({ queryKey: ["emergency_public_info"] });
    }
  }, [qr, queryClient, refetch]);

  return {
    qr,
    isLoading,
    isFetching,

    isError,
    errorMessage: error?.message,
    // No network connection or server is down
    notAvailable: error instanceof AxiosError && error.code === "ERR_NETWORK",
    notFound: error instanceof AxiosError && error.response?.status === 404,
    notAuthorized: error instanceof AxiosError && error.response?.status === 401,
    serverError: error instanceof AxiosError && error.response?.status === 500,
  };
}
