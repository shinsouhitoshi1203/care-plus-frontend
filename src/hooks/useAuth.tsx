import AuthAPI from "@/features/auth/api";
import TokenService from "@/features/auth/token";
import { useIsFetching, useQuery } from "@tanstack/react-query";
import { useEffect } from "react";

function useAuth() {
  const isFetching = useIsFetching({ queryKey: ["user"] });
  const { data: isAuthenticated, isPending } = useQuery({
    queryKey: ["user"],
    queryFn: async () => {
      const { accessToken } = await TokenService.getTokens();
      if (!accessToken) {
        return null;
      }

      return await AuthAPI.check();
    },
    select: (user) => {
      const checkID = user?.id;
      const checkActive = user?.is_active;
      return !!checkID && checkActive;
    },
    retry: false,
  });

  useEffect(() => {
    // Check if tanstack is fetching
    if (isFetching) {
      console.log("Fetching user data...", isFetching);
    }
  }, [isFetching]);
  return {
    isAuthenticated,
    isPending,
  }; // Return false if isAuthenticated is undefined (e.g., during initial loading)
}

export default useAuth;
