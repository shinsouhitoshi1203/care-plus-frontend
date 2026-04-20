import useAccount from "@/features/account/useAccount";
import useSubPageTitle from "@/hooks/useSubPageTitle";
import { formatDate } from "@/utils/datetime";
import { Skeleton } from "@rneui/themed";
import { Alert, Text, View } from "react-native";
const accountDetailDisplayMap: Record<string, string> = {
  id: "Mã người dùng",
  email: "Email",
  full_name: "Họ và tên",
  phone: "Số điện thoại",
  created_at: "Ngày tạo tài khoản",
  date_of_birth: "Ngày sinh",
};

export default function UserMoreDetailPage() {
  useSubPageTitle("Chi tiết tài khoản");
  const { data, isPending } = useAccount(
    ({ family, role, avatar_url, loginType, system_role, updated_at, is_active, ...rest }) => {
      const { date_of_birth, created_at, ...x } = rest;
      return {
        ...x,
        date_of_birth: formatDate(date_of_birth),
        created_at: formatDate(created_at),
      };
    }
  );
  return (
    <View className="flex-1 bg-slate-50 p-6 ">
      {isPending ? (
        <Skeleton className="rounded" height={100} animation="pulse" />
      ) : (
        <View className="gap-3 flex">
          {Object.entries(data || {}).map(([key, value]) => {
            const field = accountDetailDisplayMap[key] || key;
            const renderedValue = String(value) || "Chưa có";
            return (
              <View key={key} className="flex-row gap-4">
                <Text className="font-bold shrink-0 min-w-[100] ">{field}:</Text>
                <Text
                  className="flex-1 line-clamp-1"
                  onPress={() => {
                    Alert.alert(field, renderedValue, [{ text: "Đóng", style: "cancel" }]);
                  }}
                >
                  {renderedValue}
                </Text>
              </View>
            );
          })}
        </View>
      )}
    </View>
  );
}
