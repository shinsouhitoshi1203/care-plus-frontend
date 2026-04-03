import "@/global.css";
import HeaderLayout from "@/layouts/Header";
import tabBarOption from "@/layouts/TabNavigator/tabBarOption";
import { Tabs } from "expo-router";

export default function RootLayout() {
  return (
    // <View className="flex-1 ">
    <>
      <HeaderLayout />
      <Tabs screenOptions={tabBarOption}>
        <Tabs.Screen name="home" options={{ title: "Home" }} />
        <Tabs.Screen name="reminder" options={{ title: "Reminder" }} />
        <Tabs.Screen name="user" options={{ title: "Profile" }} />
      </Tabs>
    </>
    // </View>
  );
}
/* 
<View className="flex-1 p-6 w-screen">
             <Stack screenOptions={{ headerShown: false, contentStyle: { backgroundColor: "white" } }} /> 
          </View>

*/
