import noteInDevelopment from "@/utils/dev";
import { Button } from "@rneui/themed";
import { ArrowRight } from "lucide-react-native";
import { Text, View } from "react-native";
import BaseLineChart from ".";
import SelectMetricSmallDropdown from "../dropdown/SelectMetric";
export default function OverviewHealthRecordChart() {
  return (
    <View
      style={{
        paddingHorizontal: 16,
        paddingVertical: 24,
        backgroundColor: "#183f70",
        borderRadius: 16,
        minHeight: 300,
      }}
    >
      <View className="mb-4 flex ">
        <View className=" flex flex-row justify-between gap-2">
          <SelectMetricSmallDropdown />
          <Button
            icon={<ArrowRight size={24} color="white" />}
            buttonStyle={{
              backgroundColor: "#0d1c68",
              borderRadius: 16,
              borderWidth: 1,
              borderColor: "rgba(255, 255, 255, 0.22)",
            }}
            onPress={() => noteInDevelopment()}
          />
        </View>
        <View className="flex flex-row gap-2 justify-center align-center my-4">
          <View>
            <Text className="text-white text-sm">Hôm nay</Text>
          </View>
          <View className="flex flex-row gap-1">
            <Text className="text-white text-3xl font-bold">40</Text>
            <Text className="text-white text-sm unit">kg</Text>
          </View>
        </View>
      </View>
      <BaseLineChart
        chartDetail={{
          labels: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"],
          values: [10, 20, 15, 25, 30, 20, 10],
        }}
        height={160}
      />
      <Text className="text-white text-md text-center italic ">Chỉ số 7 ngày gần nhất</Text>
    </View>
  );
}
