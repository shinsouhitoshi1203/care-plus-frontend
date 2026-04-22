import apiClient from "@/config/axios";
import env from "@/config/env";
import { useQuery } from "@tanstack/react-query";
import { AxiosError } from "axios";

export default function usePublicURL() {
  const { error, data, isError } = useQuery({
    queryKey: ["public.emergency"],
    queryFn: async () => {
      const url = (await apiClient.get("/users/emergency-info/qr")).data.data;
      return url.quickAccessUrl;
    },
    select: (url) => {
      if (!url) return null;
      console.log("url", url);
      const id = url.split("/").slice(-1)[0];
      return {
        id,
        qrURL: `${env.baseWEB}/emergency/?id=${id}`,
      };
    },
    staleTime: 24 * 60 * 1000, // 24 hours
  });
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
