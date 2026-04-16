import FullSize from "@/components/buttons/FullSize";
import OverviewHealthRecordLayout from "@/features/record/layouts/overview";
import useSubPageTitle from "@/hooks/useSubPageTitle";
import { useRouter } from "expo-router";
import { View } from "react-native";

export default (function RecordDashboardPage() {
  const router = useRouter();
  useSubPageTitle("Hồ sơ sức khỏe");

  return (
    <>
      <View className="flex-1 gap-4  ">
        <OverviewHealthRecordLayout />
        <FullSize title="Thêm mới" onPress={() => router.navigate("/protected/records/add")} />
        <FullSize
          title="Xem danh sách"
          onPress={() => router.navigate({ pathname: "/protected/records/(list)", params: {} })}
        />
      </View>
    </>
  );
});
