import LoadingRaw from "@/components/Loading/LoadingRaw";
import withWaitFallback from "@/hocs/withWaitFallback";
import useAuth from "@/hooks/useAuth";
import { Redirect } from "expo-router";

function EntryPage() {
  const { isAuthenticated, isPending } = useAuth();

  if (isPending) {
    return <LoadingRaw />;
  } else if (isAuthenticated && !isPending) {
    return <Redirect href="/protected/home" />;
  }

  return <Redirect href="/(auth)/welcome" />;
}
export default withWaitFallback(EntryPage);
