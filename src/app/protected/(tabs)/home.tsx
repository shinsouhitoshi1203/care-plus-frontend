import QuickComponent from "@/features/home/components/Quick";
import { ScrollView, View } from "react-native";

import IconTextButton from "@/components/buttons/IconTextButton";
import { useRouter } from "expo-router";
import { HeartPulse, Pill, ScanLine } from "lucide-react-native";

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
      onPress: () => router.navigate("/protected/medications"),
    },
    {
      id: "scan-prescription",
      title: "Quét toa thuốc",
      icon: ScanLine,
      bg: "orange",
      iconPosition: "top",
      onPress: () => router.navigate("/protected/medications/scan"),
    },
  ];
  return (
    <ScrollView>
      <QuickComponent />
      {/* <ChartSample /> */}
      <View className="flex-1 flex" style={{ paddingHorizontal: 24 }}>
        <View className="rounded-[28px] my-6">
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
