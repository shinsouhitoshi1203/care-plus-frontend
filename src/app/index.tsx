import LoadingRaw from "@/components/Loading/LoadingRaw";
import AuthAPI from "@/features/auth/api";
import TokenService from "@/features/auth/token";
import { useQuery } from "@tanstack/react-query";
import { Redirect } from "expo-router";
function EntryPage() {
  // const { isAuthenticated, isPending } = useAuth();

  // if (isPending) {
  //   return <LoadingRaw />;
  // } else {
  //   if (isAuthenticated) {
  //     return <Redirect href="/protected/home" />;
  //   }
  //   return <Redirect href="/(auth)/welcome" />;
  // }
  // // return <Redirect href="/(auth)/welcome" />;

  const { data: isAuthenticated, isPending } = useQuery({
    queryKey: ["auth.check"],
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
  if (!isPending && isAuthenticated) {
    return <Redirect href="/protected/home" />;
  } else if (!isPending && !isAuthenticated) {
    return <Redirect href="/(auth)/welcome" />;
  } else {
    console.log("Checking authentication status...");
  }

  return <LoadingRaw />;
}
export default EntryPage;
