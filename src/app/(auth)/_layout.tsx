import { stackOptions } from "@/config/routing";
import WelcomeHeaderLayout from "@/layouts/WelcomeHeader";
import { Stack } from "expo-router";
import { View } from "react-native";

function AuthPageLayout() {
  /* const pathName = usePathname();
  useEffect(() => {
    const backHandler = BackHandler.addEventListener("hardwareBackPress", () => {
      if (pathName === "/welcome") {
        BackHandler.exitApp();
      }
      return true;
    });
    return () => {
      backHandler.remove();
    };
  }, [pathName]); */

  return (
    <View className="flex-1 p-4 bg-white">
      <WelcomeHeaderLayout />
      <Stack
        screenOptions={{
          ...stackOptions,
        }}
      ></Stack>
    </View>
  );
}
export default AuthPageLayout;
