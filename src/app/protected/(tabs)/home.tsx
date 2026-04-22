import { SOSButton } from "@/components/SOS/SOSButton";
import QuickComponent from "@/features/home/components/Quick";
import { SafeAreaContent } from "@/layouts/TabNavigator";
import { Button } from "@rneui/themed";
import { useRouter } from "expo-router";
import { HeartPulse } from "lucide-react-native";
import { Pill, ScanLine } from "lucide-react-native/icons";
import { useMemo } from "react";

import { ScrollView, StyleSheet, Text, View } from "react-native";

const styles = StyleSheet.create({
  contentContainer: {
    paddingHorizontal: 24,
    paddingTop: 4,
  },
  quickSection: {
    position: "relative",
  },
  sosOverlapContainer: {
    alignItems: "center",
    marginBottom: 12,
    marginTop: -100,
    zIndex: 20,
  },
  quickActionContainer: {
    backgroundColor: "#F1F5F9",
    borderColor: "#D1D5DB",
    borderWidth: 2,
    borderRadius: 24,
    padding: 14,
  },
  quickActionTitle: {
    color: "#0F172A",
    fontSize: 18,
    fontWeight: "700",
    marginBottom: 14,
  },
  quickActionList: {
    gap: 12,
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
        onPress: () => router.navigate("/protected/medications"),
      },
      {
        id: "enter-record",
        title: "Theo dõi sức khỏe",
        icon: HeartPulse,
        bg: "#008000",
        onPress: () => router.navigate("/protected/records"),
      },

      {
        id: "scan-prescription",
        title: "Quét toa thuốc",
        icon: ScanLine,
        bg: "#FFA500",
        onPress: () => router.navigate("/protected/medications/scan"),
      },
    ],
    [router]
  );
  return (
    <ScrollView className="bg-white" contentContainerStyle={styles.contentContainer}>
      <View style={styles.quickSection}>
        <QuickComponent />
        <View style={styles.sosOverlapContainer}>
          <SOSButton />
        </View>
      </View>

      <View className="flex-1 flex" style={styles.quickActionContainer}>
        <Text style={styles.quickActionTitle}>Truy cập nhanh</Text>
        <View style={styles.quickActionList}>
          {quickActions.map(({ id, icon, ...action }) => {
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
