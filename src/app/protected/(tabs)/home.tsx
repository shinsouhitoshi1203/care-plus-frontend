import QuickComponent from "@/features/home/components/Quick";
import { ScrollView, View } from "react-native";

import IconTextButton from "@/components/buttons/IconTextButton";
import { useRouter } from "expo-router";
import { HeartPulse, Pill } from "lucide-react-native";
import { SOSButton } from "@/components/SOS/SOSButton";

export default function HomePage() {
  const router = useRouter();
  const quickActions = [
    {
      id: "enter-record",
      title: "Theo dõi sức khỏe",
      icon: HeartPulse,
      bg: "blue",
      iconPosition: "top",
      onPress: () => router.navigate("/protected/records"),
    },
    {
      id: "medicine-schedule",
      title: "Lịch uống thuốc",
      icon: Pill,
      bg: "green",
      iconPosition: "top",
      onPress: () => router.navigate("/protected/records"),
    },
  ];
  return (
    <ScrollView className="bg-white">
      <QuickComponent />
      
      {/* Nút SOS Khẩn cấp */}
      <SOSButton />

      <View className="flex-1 flex" style={{ paddingHorizontal: 24 }}>
        <View className="rounded-[28px] mb-6">
          <View className="flex-row gap-6">
            {quickActions.map(({ id, ...action }) => (
              <View style={{ height: 150 }} key={id} className="flex-1">
                <IconTextButton key={id} {...action} />
              </View>
            ))}
          </View>
        </View>
        {/* <OverviewHealthRecordChart /> */}
      </View>
    </ScrollView>
  );
}
