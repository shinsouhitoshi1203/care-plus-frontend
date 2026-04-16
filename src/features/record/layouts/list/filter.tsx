import FullSize from "@/components/buttons/FullSize";
import { formatDate } from "@/utils/datetime";
import noteInDevelopment from "@/utils/dev";
import { useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { Pressable, Text, View } from "react-native";
import DateTimePicker from "react-native-modal-datetime-picker";
import FullSizeDropdownComponent from "../../component/dropdown/variants/FullSize";
import { healthMetricsOptions } from "../../options/metric";

type HealthRecordFilterForm = {
  date: string | null;
};

export default function HealthRecordFilter() {
  const method = useForm<HealthRecordFilterForm>({
    defaultValues: {
      date: null,
    },
  });
  const { control, setValue } = method;
  const [showDT, setShowDT] = useState(false);
  return (
    <View className="flex gap-4">
      <DateTimePicker
        isVisible={showDT}
        mode="date"
        onConfirm={(_) => {
          setValue("date", formatDate(_.toString()));
          setShowDT(false);
        }}
        onCancel={() => setShowDT(false)}
      />

      <View>
        <FullSizeDropdownComponent data={[]} placeholderText="Chọn thành viên" />
      </View>
      <View>
        <FullSizeDropdownComponent data={healthMetricsOptions} />
      </View>
      <View className="flex flex-row justify-start items-center gap-4">
        <Controller
          name="date"
          control={control}
          render={({ field }) => (
            <Text className="rounded-3xl px-6 py-3 text-lg bg-red-400 " onPress={() => setShowDT(true)}>
              {field.value || "Chọn ngày"}
            </Text>
          )}
        />
        <Pressable onPress={() => setValue("date", null)}>
          <Text className="text-blue-400 font-bold">Hủy chọn ngày</Text>
        </Pressable>
      </View>
      <FullSize title="Lọc" onPress={noteInDevelopment} />
    </View>
  );
}
