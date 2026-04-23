import apiClient from "@/config/axios";
import env from "@/config/env";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { AxiosError } from "axios";
import { useEffect } from "react";
import { getPublicEmergencyInfo } from "../api";

export default function usePublicURL() {
  const queryClient = useQueryClient();
  const { error, data, isError } = useQuery({
    queryKey: ["emergency_public_id"],
    queryFn: async () => {
      const url = (await apiClient.get("/users/emergency-info/qr")).data.data;
      return url.quickAccessUrl;
    },
    select: (url) => {
      if (!url) return null;
      // console.log("url", url);
      const id = url.split("/").slice(-1)[0];
      return {
        id,
        qrURL: `${env.baseWEB}/emergency/?id=${id}`,
      };
    },
    staleTime: 15 * 60 * 1000, // 5 minutes
    networkMode: "offlineFirst",
    meta: { persist: true },
  });

  useEffect(() => {
    if (data?.id) {
      // Fetch trước, để một hổi có gì thì đã có data rồi, không phải đợi load lại từ đầu
      const emergencyPublicID = data.id;

      void queryClient.prefetchQuery({
        queryKey: ["emergency_public_info"],
        queryFn: async () => await getPublicEmergencyInfo(emergencyPublicID),
        staleTime: 15 * 60 * 1000, // 5 minutes
        networkMode: "offlineFirst",
        meta: { persist: true },
      });
    }
  }, [data?.id, queryClient]);

  return {
    ...data,

    isError,
    errorMessage: error?.message,
    // No network connection or server is down
    notAvailable: error instanceof AxiosError && error.code === "ERR_NETWORK",
    notFound: error instanceof AxiosError && error.response?.status === 404,
    notAuthorized: error instanceof AxiosError && error.response?.status === 401,
    serverError: error instanceof AxiosError && error.response?.status === 500,
  };
}
