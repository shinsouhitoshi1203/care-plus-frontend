import { SOSButton } from "@/components/SOS/SOSButton";
import { SafeAreaContent } from "@/layouts/TabNavigator";
import { Button } from "@rneui/themed";
import { useRouter } from "expo-router";
import { HeartPulse } from "lucide-react-native";
import { Pill, ScanLine } from "lucide-react-native/icons";
import { useMemo } from "react";

import { ScrollView, StyleSheet, Text, View } from "react-native";

const styles = StyleSheet.create({
  quickActionContainer: {
    padding: 12,
    // height: 200,
    backgroundColor: "#f0f0f0",
    borderColor: "#ccc",
    borderWidth: 2,
    borderRadius: 20,
  },
});

export default function HomePage() {
  const router = useRouter();
  const quickActions = useMemo(
    () => [
      {
        id: "medicine-schedule",
        title: "Lịch uống thuốc",
        icon: Pill,
        bg: "#424601",
        iconPosition: "top",
        onPress: () => router.navigate("/protected/medications"),
      },
      {
        id: "enter-record",
        title: "Theo dõi sức khỏe",
        icon: HeartPulse,
        bg: "#008000",
        iconPosition: "top",
        onPress: () => router.navigate("/protected/records"),
      },

      {
        id: "scan-prescription",
        title: "Quét toa thuốc",
        icon: ScanLine,
        bg: "#FFA500",
        iconPosition: "top",
        onPress: () => router.navigate("/protected/medications/scan"),
      },
    ],
    [router]
  );
  return (
    <ScrollView className="bg-white gap-8" style={{ paddingHorizontal: 24 }}>
      {/* <QuickComponent /> */}
      {/* Nút SOS Khẩn cấp */}
      <View className="py-10">
        <SOSButton />
      </View>
      <View className="flex-1 flex" style={styles.quickActionContainer}>
        <Text className="text-lg font-bold" style={{ marginBottom: 12 }}>
          Truy cập nhanh
        </Text>
        <View style={{ gap: 12 }}>
          {quickActions.map(({ id, iconPosition, icon, ...action }) => {
            const IconComponent = icon ?? null;
            return (
              <View style={{ height: 80, width: "100%" }} key={id}>
                <Button
                  type="solid"
                  icon={IconComponent ? <IconComponent size={24} color="white" /> : undefined}
                  iconPosition="left"
                  buttonStyle={{
                    justifyContent: "flex-start",
                    gap: 12,
                    backgroundColor: action.bg + "a0",
                    height: "100%",
                    borderRadius: 16,
                    borderColor: action.bg,
                    borderWidth: 2,
                    paddingHorizontal: 24,
                  }}
                  titleStyle={{ color: "white", fontSize: 18, fontWeight: "900" }}
                  key={id}
                  {...action}
                />
              </View>
            );
          })}
        </View>
      </View>
      <SafeAreaContent />
    </ScrollView>
  );
}
