import { Text, View } from "react-native";

function WelcomeComponent() {
  return (
    <View className="flex gap-1 max-w-[70%]">
      <Text className="text-md">Welcome</Text>
      <Text className="text-xl md:text-2xl font-bold text-ellipsis line-clamp-1 uppercase">Mai Thanh Long</Text>
    </View>
  );
}
export default WelcomeComponent;
