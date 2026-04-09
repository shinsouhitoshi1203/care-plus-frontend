import TokenService from "@/features/auth/token";
import tanstackClient from "@/stores/tanstack";
import { useQuery } from "@tanstack/react-query";

function useAuth(): boolean {
  const { data: isAuthenticated } = useQuery<boolean>(
    {
      queryKey: ["auth"],
      queryFn: async () => {
        // Implement your logic to check if the user is authenticated
        // For example, you can check if a valid access token exists in secure storage
        const { accessToken, refreshToken } = await TokenService.getTokens();
        return !!accessToken && !!refreshToken; // Return true if both tokens exist, false otherwise
      },
    },
    tanstackClient
  );

  return isAuthenticated || false; // Return false if isAuthenticated is undefined (e.g., during initial loading)
}

export default useAuth;
