import useAuth from "@/hooks/useAuth";
import { Redirect } from "expo-router";

function EntryPage() {
  const isAuthenticated = useAuth();
  console.log("isAuthenticated:", isAuthenticated);
  if (isAuthenticated) {
    console.log("User is authenticated, redirecting to /protected/home");
    return <Redirect href="/protected/home" />;
  }

  return <Redirect href="/welcome" />;
}
export default EntryPage;
