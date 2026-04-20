import img from "@/assets/images";
import UserAvatar from "@/components/UserAvatar";
import { Image, View } from "react-native";

function ProtectedHeaderLayout() {
  return (
    <View className="w-full py-2 px-6 flex-row items-center justify-between gap-2">
      <Image source={img.logo_horizontal} style={{ width: 100, aspectRatio: 16 / 9 }} resizeMode="contain" />
      <UserAvatar />
    </View>
  );
}
export default ProtectedHeaderLayout;
