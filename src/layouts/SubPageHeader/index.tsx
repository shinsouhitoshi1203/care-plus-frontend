import useZustandStore from "@/stores/zustand";
import { Button } from "@rneui/themed";
import { useRouter } from "expo-router";
import { ArrowLeftIcon, HomeIcon } from "lucide-react-native";
import { Text, View } from "react-native";
export default function SubPageHeader() {
  const router = useRouter();
  const title = useZustandStore((state) => state.behavior.subPage.title);

  return (
    <View className="flex-row items-center justify-between px-4 py-2 gap-2">
      <Button icon={<ArrowLeftIcon color="#000" />} type="clear" onPress={() => router.back()} />
      <Text className="text-lg font-bold line-clamp-1 flex-1 text-center">{title}</Text>
      <Button icon={<HomeIcon color="#000" />} type="clear" onPress={() => router.navigate("/protected/(tabs)/home")} />
    </View>
  );
}
