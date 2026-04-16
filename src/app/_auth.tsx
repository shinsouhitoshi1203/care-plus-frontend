import { stackOptions } from "@/config/routing";
import useZustandStore from "@/stores/zustand";
import { Stack } from "expo-router";
import { Suspense } from "react";
import { SafeAreaView } from "react-native-safe-area-context";

function AuthProvider() {
  const setLoading = useZustandStore((state) => state.setLoading);
  return (
    <>
      <Suspense fallback={<></>}>
        <SafeAreaView className="flex-1">
          <Stack
            screenOptions={stackOptions}
            screenListeners={{
              transitionStart: () => setLoading(true),
              transitionEnd: () => setLoading(false),
            }}
          >
            <Stack.Screen name="index" />
            <Stack.Screen name="(auth)" />
            <Stack.Screen name="protected" />
          </Stack>
        </SafeAreaView>
      </Suspense>
    </>
  );
}
export default AuthProvider;
