import { stackOptions } from "@/config/routing";
import { Stack } from "expo-router";
import { Platform, Text } from "react-native";

export default function WebEmergencyLayout() {
  const isWeb = Platform.OS === "web";
  if (!isWeb) {
    return (
      <>
        <Text> Xem trên web </Text>
      </>
    );
  }
  return (
    <>
      <Stack screenOptions={stackOptions} />
    </>
  );
}
