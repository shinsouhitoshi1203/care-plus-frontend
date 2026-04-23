import EmergencyDetails from "@/features/emergency/components/Details";
import EmergencyNumbers from "@/features/emergency/layouts/EmergencyNumbers";
import withWaitFallback from "@/hocs/withWaitFallback";
import useZustandStore from "@/stores/zustand";
import { Card } from "@rneui/themed";
import { useFocusEffect } from "expo-router";
import { AlertCircle, Droplets, Pill, QrCode, Stethoscope, UserRound, Users } from "lucide-react-native";
import { useCallback } from "react";
import { ScrollView, Text, View } from "react-native";

const EMERGENCY_PROFILE = [
  {
    key: "blood-type",
    title: "Nhóm máu",
    value: "A+",
    icon: Droplets,
    tone: "rose",
  },
  {
    key: "allergies",
    title: "Tiền sử dị ứng",
    value: "Penicillin, hải sản",
    icon: AlertCircle,
    tone: "amber",
  },
  {
    key: "chronic-diseases",
    title: "Tiền sử bệnh nền",
    value: "Tăng huyết áp, đái tháo đường type 2",
    icon: Stethoscope,
    tone: "sky",
  },
  {
    key: "medications",
    title: "Nhóm thuốc đang dùng",
    value: "Hạ áp, kháng đông",
    icon: Pill,
    tone: "teal",
  },
  {
    key: "emergency-contacts",
    title: "Liên hệ khẩn cấp",
    value: "Nguyen Van B (Con trai) - 0901 234 567",
    icon: Users,
    tone: "orange",
  },
  {
    key: "doctor-contact",
    title: "Bác sĩ theo dõi",
    value: "BS. Tran Minh C - 0912 345 678",
    icon: UserRound,
    tone: "slate",
  },
] as const;

function EmergencyDashboard() {
  const setSubPageTitle = useZustandStore((state) => state.setSubPageTitle);
  useFocusEffect(
    useCallback(() => {
      // Do something when the screen is focused (e.g., fetch data)
      setSubPageTitle("Thông tin khẩn cấp");

      return () => {
        // Optional: Cleanup when the screen is unfocused or unmounted
        setSubPageTitle("");
      };
    }, [setSubPageTitle])
  );

  const openModal = useZustandStore((state) => state.openModal);

  return (
    <ScrollView className="flex-1 bg-slate-50" contentContainerStyle={{ padding: 16, gap: 14, paddingBottom: 28 }}>
      <Card containerStyle={{ margin: 0, borderRadius: 20, borderColor: "#FCA5A5", backgroundColor: "#FEF2F2" }}>
        <View className="flex-row items-start justify-between gap-4">
          <View className="flex-1">
            <Text className="text-slate-900 text-xl font-extrabold mt-1">Thông tin khẩn cấp</Text>
            <Text className="text-slate-600 mt-2 leading-5">
              Mở mã QR để nhân viên y tế hoặc người hỗ trợ quét nhanh thông tin quan trọng.
            </Text>
          </View>
          <View className="h-12 w-12 rounded-2xl bg-red-100 items-center justify-center">
            <QrCode size={24} color="#DC2626" />
          </View>
        </View>

        <View className="mt-4">
          <Text
            className="text-center text-white font-bold py-3 rounded-2xl bg-red-600"
            onPress={() => openModal("emergency-qr")}
          >
            Mở QR khẩn cấp
          </Text>
        </View>
      </Card>

      <EmergencyNumbers />
      <EmergencyDetails />
      {/* <Card containerStyle={{ margin: 0, borderRadius: 20, borderColor: "#E2E8F0" }}>
        <View className="flex-row items-center justify-between">
          <Text className="text-slate-900 text-lg font-bold">Thông tin sinh tồn khẩn cấp</Text>
        </View>

        <View className="mt-4 gap-3">
          {EMERGENCY_PROFILE.map((item) => {
            const tone = toneClassMap[item.tone];
            const Icon = item.icon;

            return (
              <View key={item.key} className="rounded-2xl border border-slate-200 bg-white p-4">
                <View className="flex-row items-center justify-between">
                  <View className="flex-row items-center gap-3">
                    <View className={`h-10 w-10 rounded-xl items-center justify-center ${tone.bg}`}>
                      <Icon size={18} color={tone.icon} />
                    </View>
                    <View>
                      <Text className="text-slate-900 font-semibold">{item.title}</Text>
                    </View>
                  </View>
                </View>
                <View className="items-end">
                  <Text className={`text-sm font-bold text-right ${tone.value}`}>{item.value}</Text>
                </View>
              </View>
            );
          })}
        </View>
      </Card> */}
    </ScrollView>
  );
}
export default withWaitFallback(EmergencyDashboard);
