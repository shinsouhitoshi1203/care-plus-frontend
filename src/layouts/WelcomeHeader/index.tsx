import img from "@/assets/images";
import { Image, View } from "react-native";

function WelcomeHeaderLayout() {
  return (
    <View className="w-full py-2 px-4 flex-row items-center justify-center gap-2">
      <Image source={img.logo_horizontal} style={{ width: 100, aspectRatio: 16 / 9 }} resizeMode="contain" />
    </View>
  );
}
export default WelcomeHeaderLayout;
