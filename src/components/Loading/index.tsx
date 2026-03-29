import { ActivityIndicator, View } from "react-native";

function Loading() {
  return (
    <View className="flex-1 justify-center items-center bg-[rgba(255,255,255,0.8)]">
      <ActivityIndicator size="large" color="#ff00ff" className="flex-1 justify-center items-center" />
    </View>
  );
}
export default Loading;
