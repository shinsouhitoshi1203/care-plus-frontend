import FullSize from "@/components/buttons/FullSize";
import OverviewHealthRecordLayout from "@/features/record/layouts/overview";
import useSubPageTitle from "@/hooks/useSubPageTitle";
import { useRouter } from "expo-router";
import { View } from "react-native";

export default (function RecordDashboardPage() {
  useSubPageTitle("Tổng quan hồ sơ sức khỏe");
  const router = useRouter();
  return (
    <>
      <View className="flex-1 gap-4  ">
        <OverviewHealthRecordLayout />
        <FullSize title="Thêm mới" onPress={() => router.navigate("/protected/records/add")} />
      </View>
    </>
  );
});
