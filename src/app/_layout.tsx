import Loading from "@/components/Loading";
import { stackOptions } from "@/config/routing";
import useAuth from "@/hooks/useAuth";
import tanstackClient from "@/stores/tanstack";
import { QueryClientProvider } from "@tanstack/react-query";
import { Stack } from "expo-router";
import { Suspense } from "react";
import { SafeAreaView } from "react-native-safe-area-context";

export default function RootLayout() {
  let isLogin = useAuth();
  return (
    <QueryClientProvider client={tanstackClient}>
      <Suspense fallback={<Loading />}>
        <SafeAreaView className="flex-1">
          <Stack screenOptions={stackOptions}>
            <Stack.Screen name="index" />
            <Stack.Protected guard={!isLogin}>
              <Stack.Screen name="(auth)" />
            </Stack.Protected>
            <Stack.Protected guard={isLogin}>
              <Stack.Screen name="protected/(tabs)" />
            </Stack.Protected>
          </Stack>
        </SafeAreaView>
      </Suspense>
    </QueryClientProvider>
  );
}
