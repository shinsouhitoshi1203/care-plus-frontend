import IconTextButton from "@/components/buttons/IconTextButton";
import OverviewHealthRecordLayout from "@/features/record/layouts/overview";
import useSubPageTitle from "@/hooks/useSubPageTitle";
import { useRouter } from "expo-router";
import { Plus } from "lucide-react-native";
import { useMemo } from "react";
import { View } from "react-native";

export default (function RecordDashboardPage() {
  const router = useRouter();
  useSubPageTitle("Hồ sơ sức khỏe");

  const quickActions = useMemo(() => {
    return [
      {
        icon: Plus,
        title: "Thêm mới",
        onPress: () => router.navigate("/protected/records/add"),
        iconPosition: "top",
        bg: "error",
      },
      {
        icon: Plus,
        title: "Xem danh sách",
        onPress: () => router.navigate({ pathname: "/protected/records/(list)", params: {} }),
        iconPosition: "top",
        bg: "primary",
      },
    ];
  }, [router]);

  return (
    <>
      <View className="flex-1 gap-4 pt-4 flex ">
        <View className="flex flex-row gap-4 " style={{ height: 150 }}>
          {quickActions.map(({ icon, ...rest }) => (
            <View key={rest.title} className="flex-1">
              <IconTextButton icon={icon} {...rest} />
            </View>
          ))}
        </View>
        <OverviewHealthRecordLayout />
      </View>
    </>
  );
});
