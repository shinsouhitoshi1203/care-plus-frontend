import { stackOptions } from "@/config/routing";
import { Stack } from "expo-router";

export default function UserEmergencyLayout() {
  console.log("SUCKER");

  return (
    <>
      <Stack screenOptions={stackOptions} />
    </>
  );
}
