import { useRouter } from "expo-router";
import { Text, View } from "react-native";

export default function Index() {
  const router = useRouter();
  return (
    <View>
      <Text className="text-2xl font-bold">Welcome to Care Plus!</Text>
    </View>
  );
}
