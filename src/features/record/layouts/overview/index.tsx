import { Text, View } from "react-native";
import OverviewHealthRecordChart from "../../component/chart/Overview";

export default function OverviewHealthRecordLayout() {
  return (
    <View>
      <Text className="text-2xl font-bold mb-4">Tổng quan tình hình sức khỏe</Text>
      <OverviewHealthRecordChart />
    </View>
  );
}
