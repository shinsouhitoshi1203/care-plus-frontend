import ConfirmDialog from "@/components/dialogs/Confirm";
import LoadingWithZustand from "@/components/Loading";
import "@/global.css";
import ProtectedHeaderLayout from "@/layouts/ProtectedHeader";
import tabBarOption from "@/layouts/TabNavigator/tabBarOption";
import { Tabs } from "expo-router";

export default function RootLayout() {
  return (
    <>
      <LoadingWithZustand />
      <ProtectedHeaderLayout />
      <Tabs screenOptions={tabBarOption}>
        <Tabs.Screen name="home" options={{ title: "Home" }} />
        <Tabs.Screen name="reminder" options={{ title: "Reminder" }} />
        <Tabs.Screen name="user" options={{ title: "Profile" }} />
      </Tabs>
      <ConfirmDialog />
    </>
  );
}
