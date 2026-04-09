import AuthAPI from "@/features/auth/api";
import { useQuery } from "@tanstack/react-query";

function useAuth() {
  const { data: user, isPending } = useQuery({
    queryKey: ["user"],
    queryFn: async () => {
      // Implement your logic to check if the user is authenticated
      // For example, you can check if a valid access token exists in secure storage
      // const { accessToken, refreshToken } = await TokenService.getTokens();
      // return !!accessToken && !!refreshToken; // Return true if both tokens exist, false otherwise
      return await AuthAPI.check();
    },
  });
  console.log("userID", user?.id !== undefined);
  return {
    isAuthenticated: user?.id !== undefined,
    user,
    isPending,
  }; // Return false if isAuthenticated is undefined (e.g., during initial loading)
}

export default useAuth;
