import ButtonList from "@/components/ButtonList";
import useAccount from "@/features/account/useAccount";
import useSubPageTitle from "@/hooks/useSubPageTitle";
import noteInDevelopment from "@/utils/dev";
import { Card } from "@rneui/themed";
import { useRouter } from "expo-router";
import { BellRing, CircleHelp, FileText, ShieldCheck, UserCog } from "lucide-react-native";
import { Alert, Linking, ScrollView, Text, View } from "react-native";

export default function UserDetailPage() {
  const router = useRouter();
  useSubPageTitle("Thông tin cá nhân");
  const { user } = useAccount();
  const userOptions = [
    {
      id: "account_settings",
      title: "Cài đặt tài khoản",
      icon: ShieldCheck,
      onPress: () => {
        noteInDevelopment();
      },
    },
    {
      id: "notification_settings",
      title: "Cài đặt thông báo",
      icon: BellRing,
      onPress: () => {
        Alert.alert("Thông báo", "Mở cài đặt hệ thống để bật thông báo cho Care+", [
          { text: "Để sau", style: "cancel" },
          { text: "Mở cài đặt", onPress: () => Linking.openSettings() },
        ]);
      },
    },
    {
      id: "usage_guide",
      title: "Hướng dẫn sử dụng",
      icon: CircleHelp,
      onPress: () => {
        router.push("/protected/userDetails/guide");
      },
    },
    {
      id: "terms_privacy",
      title: "Điều khoản & chính sách",
      icon: FileText,
      onPress: () => {
        noteInDevelopment();
      },
    },
  ];
  return (
    <ScrollView className="flex-1 bg-slate-50" contentContainerStyle={{ padding: 16, gap: 12 }}>
      <Card containerStyle={{ margin: 0, borderRadius: 20, borderColor: "#E2E8F0" }}>
        <View className="flex-row items-center gap-7">
          <View className="h-10 w-10 rounded-xl bg-blue-100 items-center justify-center">
            <UserCog size={20} color="#1D4ED8" />
          </View>
          <View className="flex-1">
            <Text className="text-lg font-bold text-slate-900">{user?.full_name || "Người dùng"}</Text>
          </View>
        </View>
      </Card>

      <ButtonList data={userOptions} />
    </ScrollView>
  );
}
