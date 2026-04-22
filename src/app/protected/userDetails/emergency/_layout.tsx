import { stackOptions } from "@/config/routing";
import { Stack } from "expo-router";

export default function EmergencyLayout() {
  return (
    <>
      <Stack screenOptions={stackOptions} />
    </>
  );
}
