import { stackOptions } from "@/config/routing";
import SubPageHeader from "@/layouts/SubPageHeader";
import { Stack } from "expo-router";

export default function EmergencyLayout() {
  return (
    <>
      <SubPageHeader />
      <Stack screenOptions={stackOptions} />
    </>
  );
}
