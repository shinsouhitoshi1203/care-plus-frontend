import AuthAPI from "@/features/auth/api";
import TokenService from "@/features/auth/token";
import { useIsFetching, useQuery } from "@tanstack/react-query";
import { useEffect } from "react";

function useAuth() {
  const isFetching = useIsFetching({ queryKey: ["user"] });
  const { data: user, isPending } = useQuery({
    queryKey: ["user"],
    queryFn: async () => {
      const { accessToken } = await TokenService.getTokens();
      if (!accessToken) {
        return null;
      }

      return await AuthAPI.check();
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
    isAuthenticated: user?.id !== undefined,
    user,
    isPending,
  }; // Return false if isAuthenticated is undefined (e.g., during initial loading)
}

export default useAuth;
