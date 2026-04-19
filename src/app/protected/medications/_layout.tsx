import SubPageHeader from "@/layouts/SubPageHeader";
import { Stack } from "expo-router";

export default function MedicationsLayout() {
  return (
    <>
      <SubPageHeader />
      <Stack screenOptions={{ headerShown: false }}>
        <Stack.Screen name="index" />
        <Stack.Screen name="scan" />
      </Stack>
    </>
  );
}
