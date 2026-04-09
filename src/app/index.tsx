import useAuth from "@/hooks/useAuth";
import { Redirect } from "expo-router";
import { View } from "react-native";

function EntryPage() {
  const { isAuthenticated, user, isPending } = useAuth();

  if (isPending) {
    return (
      <View className="flex-1 items-center justify-center">
        {/* You can replace this with a loading spinner or any loading indicator */}
      </View>
    );
  } else if (isAuthenticated && user) {
    return <Redirect href="/protected/home" />;
  }

  return <Redirect href="/(auth)/welcome" />;
}
export default EntryPage;
