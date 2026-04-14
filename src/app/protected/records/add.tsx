import useSubPageTitle from "@/hooks/useSubPageTitle";
import { View } from "react-native";

export default (function RecordDashboardPage() {
  useSubPageTitle("Thêm hồ sơ sức khỏe");
  return (
    <>
      <View className="flex-1 gap-4"></View>
    </>
  );
});
