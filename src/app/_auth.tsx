import LoadingRaw from "@/components/Loading/LoadingRaw";
import { stackOptions } from "@/config/routing";
import useAuth from "@/hooks/useAuth";
import { Stack } from "expo-router";
import { Suspense } from "react";
import { SafeAreaView } from "react-native-safe-area-context";

function AuthProvider() {
  const { isAuthenticated, isPending } = useAuth();
  return (
    <>
      <Suspense fallback={<LoadingRaw />}>
        <SafeAreaView className="flex-1">
          {isPending ? (
            <LoadingRaw />
          ) : (
            <Stack screenOptions={stackOptions}>
              <Stack.Screen name="index" />
              <Stack.Screen name="(auth)" />
              <Stack.Protected guard={isAuthenticated}>
                <Stack.Screen name="protected/(tabs)" />
                <Stack.Screen name="protected/records" />
              </Stack.Protected>
            </Stack>
          )}
        </SafeAreaView>
      </Suspense>
    </>
  );
}
export default AuthProvider;
