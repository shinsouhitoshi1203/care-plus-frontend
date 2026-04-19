import { stackOptions } from "@/config/routing";
import withWaitFallback from "@/hocs/withWaitFallback";
import useAuth from "@/hooks/useAuth";
import useZustandStore from "@/stores/zustand";
import { Stack } from "expo-router";

function ProtectedLayout() {
  const { isAuthenticated, isPending } = useAuth();
  const setLoading = useZustandStore((state) => state.setLoading);
    
  return (
    <Stack
      screenOptions={stackOptions}
      screenListeners={{
        transitionEnd: () => setLoading(false),
        transitionStart: () => setLoading(true),
      }}
    >
      <Stack.Protected guard={isAuthenticated}>
        <Stack.Screen name="(tabs)" />
        <Stack.Screen name="medications" />
        <Stack.Screen name="records" />
        <Stack.Screen name="family/[familyId]" />
      </Stack.Protected>
    </Stack>
  );
}
export default withWaitFallback(ProtectedLayout);
