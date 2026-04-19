import IconTextButton from "@/components/buttons/IconTextButton";
import { SOSButton } from "@/components/SOS/SOSButton";
import { useRouter } from "expo-router";
import { HeartPulse } from "lucide-react-native";
import { Info, Pill, ScanLine } from "lucide-react-native/icons";
import { useMemo } from "react";

import { ScrollView, View } from "react-native";
export default function HomePage() {
  const router = useRouter();
  const quickActions = useMemo(
    () => [
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
        bg: "#424601",
        iconPosition: "top",
        onPress: () => router.navigate("/protected/medications"),
      },
      {
        id: "scan-prescription",
        title: "Quét toa thuốc",
        icon: ScanLine,
        bg: "#FFA500",
        iconPosition: "top",
        onPress: () => router.navigate("/protected/medications/scan"),
      },
      {
        id: "usage-guide",
        title: "Hướng dẫn sử dụng",
        icon: Info,
        bg: "#04409f",
        iconPosition: "top",
        onPress: () => router.navigate("/protected/userDetails/guide"),
      },
    ],
    [router]
  );
  return (
    <ScrollView className="bg-white">
      {/* <QuickComponent /> */}

      {/* Nút SOS Khẩn cấp */}
      <View className="py-10">
        <SOSButton />
      </View>

      <View className="flex-1 flex" style={{ paddingHorizontal: 24 }}>
        <View className="rounded-[28px] mb-6">
          <View className="flex flex-row flex-wrap gap-3">
            {quickActions.map(({ id, ...action }) => (
              <View style={{ height: 150, minWidth: 150 }} key={id} className="flex-1 ">
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
