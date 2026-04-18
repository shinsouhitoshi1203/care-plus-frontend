import { stackOptions } from "@/config/routing";
import { Stack } from "expo-router";
import { Platform } from "react-native";

export default function EmergencyLayout() {
  if (Platform.OS !== "web") return null;
  return (
    <>
      <Stack screenOptions={stackOptions} />
    </>
  );
}
