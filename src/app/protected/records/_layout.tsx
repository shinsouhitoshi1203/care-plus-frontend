import SubPageHeader from "@/layouts/SubPageHeader";
import useZustandStore from "@/stores/zustand";
import { Stack } from "expo-router";

export default function HealthRecordLayout() {
  const setLoading = useZustandStore((state) => state.setLoading);
  return (
    <>
      <SubPageHeader />
      <Stack
        screenOptions={{
          headerShown: false,
          contentStyle: {
            paddingVertical: 12,
            paddingHorizontal: 24,
          },
        }}
        screenListeners={{
          transitionStart: () => {
            setLoading(true);
          },
          transitionEnd: () => {
            setLoading(false);
          },
        }}
      >
        <Stack.Screen name="index" options={{ title: "My Profile" }} />
        <Stack.Screen name="add" options={{ title: "My Profile" }} />
      </Stack>
    </>
  );
}
