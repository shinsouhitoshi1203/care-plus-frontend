import ButtonList from "@/components/ButtonList";
import IconTextButton from "@/components/buttons/IconTextButton";
import useAccount from "@/features/account/useAccount";
import useSubPageTitle from "@/hooks/useSubPageTitle";
import noteInDevelopment from "@/utils/dev";
import { useRouter } from "expo-router";
import { BellRing, ChevronRight, CircleHelp, ShieldCheck, UserCog } from "lucide-react-native";
import { Alert, Linking, Pressable, ScrollView, Text, View } from "react-native";

export default function UserDetailPage() {
  const router = useRouter();
  useSubPageTitle("Thông tin cá nhân");
  const { data: full_name } = useAccount((_) => _.full_name);
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
  ];
  return (
    <ScrollView className="flex-1 bg-slate-50" contentContainerStyle={{ padding: 16, gap: 12 }}>
      <Pressable
        style={{ margin: 0, borderRadius: 20, padding: 20, borderColor: "#E2E8F0", backgroundColor: "#04409f" }}
        onPress={() => router.push("/protected/userDetails/more")}
      >
        <View className="flex-row items-center gap-7">
          <View className="h-10 w-10 rounded-xl bg-blue-100 items-center justify-center">
            <UserCog size={20} color="#1D4ED8" />
          </View>
          <View className="flex-1 ">
            <Text className="text-lg font-bold text-white">{full_name || "Người dùng"}</Text>
          </View>
          <View>
            <IconTextButton
              buttonStyle={{ height: 30, width: 30, minHeight: 0, padding: 0 }}
              icon={ChevronRight}
              type="clear"
            />
          </View>
        </View>
      </Pressable>

      <ButtonList data={userOptions} />
    </ScrollView>
  );
}
