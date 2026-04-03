import Loading from "@/components/Loading";
import tanstackClient from "@/stores/tanstack";
import { QueryClientProvider } from "@tanstack/react-query";
import { Stack } from "expo-router";
import { Suspense } from "react";
import { SafeAreaView } from "react-native-safe-area-context";

export default function RootLayout() {
  let isLogin = false;
  return (
    <QueryClientProvider client={tanstackClient}>
      <Suspense fallback={<Loading />}>
        <SafeAreaView className="flex-1">
          <Stack screenOptions={{ headerShown: false, contentStyle: { backgroundColor: "white" } }}>
            <Stack.Protected guard={!isLogin}>
              <Stack.Screen name="auth" />
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
