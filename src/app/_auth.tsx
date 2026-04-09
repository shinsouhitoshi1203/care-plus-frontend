import LoadingRaw from "@/components/Loading/LoadingRaw";
import { stackOptions } from "@/config/routing";
import useAuth from "@/hooks/useAuth";
import { Stack } from "expo-router";
import { Suspense } from "react";
import { SafeAreaView } from "react-native-safe-area-context";

function AuthProvider() {
  const { isAuthenticated, user } = useAuth();
  return (
    <>
      <Suspense fallback={<LoadingRaw />}>
        <SafeAreaView className="flex-1">
          <Stack screenOptions={stackOptions}>
            <Stack.Screen name="index" />
            <Stack.Screen name="sucker" />
            {/* <Stack.Protected guard={!isAuthenticated}> */}
            <Stack.Screen name="(auth)" />
            {/* <Stack.Screen name="(auth)/welcome" /> */}
            {/* </Stack.Protected> */}
            <Stack.Protected guard={isAuthenticated && user}>
              <Stack.Screen name="protected/(tabs)" />
            </Stack.Protected>
          </Stack>
        </SafeAreaView>
      </Suspense>
    </>
  );
}
export default AuthProvider;
