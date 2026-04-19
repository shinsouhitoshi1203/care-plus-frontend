import ConfirmDialog from "@/components/dialogs/Confirm";
import "@/global.css";
import withWaitFallback from "@/hocs/withWaitFallback";
import ProtectedHeaderLayout from "@/layouts/ProtectedHeader";
import tabBarOption from "@/layouts/TabNavigator/tabBarOption";
import { Tabs } from "expo-router";

export default withWaitFallback(function RootLayout() {
  return (
    <>
      <ProtectedHeaderLayout />
      <Tabs screenOptions={tabBarOption}>
        <Tabs.Screen name="home" options={{ title: "Trang chủ" }} />
        <Tabs.Screen name="family" options={{ title: "Gia đình" }} />
        <Tabs.Screen name="reminder" options={{ title: "Nhắc lịch" }} />
        <Tabs.Screen name="user" options={{ title: "Cá nhân" }} />
      </Tabs>
      <ConfirmDialog />
    </>
  );
});
