import ButtonList from "@/components/ButtonList";
import { SOSButton } from "@/components/SOS/SOSButton";
import GreetingComponent from "@/features/home/components/Greeting";
import { SafeAreaContent } from "@/layouts/TabNavigator";
import { Button } from "@rneui/themed";
import { useRouter } from "expo-router";
import { HeartPulse, InfoIcon, Siren } from "lucide-react-native";
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
    borderWidth: 1,
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

  otherFeatureCard: {
    flex: 1,
    minWidth: 120,
    height: 100,
    borderWidth: 1,
    borderColor: "#00f",
    borderRadius: 12,
    backgroundColor: "#FFFFFF",
    padding: 10,
    gap: 4,
    alignItems: "center",
    justifyContent: "center",
  },
  otherFeatureTitle: {
    color: "#00f",
    fontSize: 18,
    fontWeight: "700",
    marginBottom: 14,
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

  const otherFeatures = useMemo(
    () => [
      {
        id: "emergency",
        title: "Thông tin khẩn cấp",
        icon: Siren,
        sub: "Thông tin và hướng dẫn khi có tình huống khẩn cấp",
        bg: "#FF0000",
        onPress: () => {
          router.navigate("/protected/userDetails/emergency");
        },
      },
      {
        id: "guide-support",
        title: "Hướng dẫn sử dụng",
        sub: "Xem hướng dẫn chi tiết về cách sử dụng ứng dụng",
        icon: InfoIcon,
        bg: "#0000FF",
        onPress: () => {
          router.navigate("/protected/userDetails/guide");
        },
      },
    ],
    [router]
  );

  return (
    <ScrollView className="bg-white" contentContainerStyle={styles.contentContainer}>
      <View style={styles.quickSection}>
        <GreetingComponent />
        <View style={styles.sosOverlapContainer}>
          <SOSButton />
        </View>
      </View>

      <View className="flex-1 flex">
        <Text className="mb-5">Truy cập nhanh</Text>
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
      <View className="flex-1 flex my-8">
        <Text className="mb-5">Các tính năng khác</Text>
        <ButtonList data={otherFeatures as any} />
      </View>
      <SafeAreaContent />
    </ScrollView>
  );
}
