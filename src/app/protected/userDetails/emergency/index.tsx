import EmergencyDetails from "@/features/emergency/components/Details";
import EmergencyNumbers from "@/features/emergency/layouts/EmergencyNumbers";
import withWaitFallback from "@/hocs/withWaitFallback";
import useZustandStore from "@/stores/zustand";
import { Card } from "@rneui/themed";
import { useFocusEffect } from "expo-router";
import { QrCode } from "lucide-react-native";
import { useCallback } from "react";
import { ScrollView, Text, View } from "react-native";

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

      <EmergencyDetails />
      <EmergencyNumbers />
    </ScrollView>
  );
}
export default withWaitFallback(EmergencyDashboard);
