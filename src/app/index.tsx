import useAuth from "@/hooks/useAuth";
import { Redirect } from "expo-router";

function EntryPage() {
  const { isAuthenticated } = useAuth();

  if (isAuthenticated) {
    return <Redirect href="/protected/home" />;
  }

  return <Redirect href="/(auth)/welcome" />;
}
export default EntryPage;
