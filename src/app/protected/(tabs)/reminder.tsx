import ButtonList from "@/components/ButtonList";
import { useRouter } from "expo-router";
import { BellRing, BookOpenCheck, Pill, ScanLine } from "lucide-react-native";
import { useMemo } from "react";
import { Alert, Linking, ScrollView, Text, View } from "react-native";

type ReminderItem = {
  id: string;
  title: string;
  subtitle: string;
  icon: React.ComponentType<{ size?: number; color?: string }>;
  onPress: () => void;
};

function ReminderPage() {
  const router = useRouter();

  const reminderItems: ReminderItem[] = useMemo(
    () => [
      {
        id: "medication-schedule",
        title: "Lịch uống thuốc",
        subtitle: "Xem và quản lý các lịch nhắc hiện tại",
        icon: Pill,
        onPress: () => router.push("/protected/medications"),
      },
      {
        id: "scan-prescription",
        title: "Quét toa thuốc",
        subtitle: "Tạo nhanh lịch thuốc từ ảnh toa",
        icon: ScanLine,
        onPress: () => router.push("/protected/medications/scan"),
      },
      {
        id: "notification-permission",
        title: "Cài đặt thông báo",
        subtitle: "Kiểm tra quyền để nhận nhắc lịch ở màn hình khóa",
        icon: BellRing,
        onPress: () =>
          Alert.alert("Thông báo", "Mở cài đặt hệ thống để bật thông báo cho Care+", [
            { text: "Để sau", style: "cancel" },
            { text: "Mở cài đặt", onPress: () => Linking.openSettings() },
          ]),
      },
      {
        id: "guide",
        title: "Hướng dẫn sử dụng",
        subtitle: "Xem hướng dẫn thao tác và mẹo an toàn",
        icon: BookOpenCheck,
        onPress: () => router.push("/protected/userDetails/guide"),
      },
    ],
    [router]
  );

  return (
    <ScrollView className="flex-1 bg-slate-50" contentContainerStyle={{ padding: 16, gap: 12 }}>
      <View className="flex-1 px-2 py-8">
        <Text className="text-3xl font-bold text-slate-900">Nhắc lịch thông minh</Text>
        <Text className="text-slate-600 mt-1">Quản lý lịch thuốc và kiểm tra thông báo trong một nơi.</Text>
      </View>

      <ButtonList data={reminderItems} />
    </ScrollView>
  );
}
export default ReminderPage;
