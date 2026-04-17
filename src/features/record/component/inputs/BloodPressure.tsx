import { Input } from "@rneui/themed";
import { Controller, useFormContext } from "react-hook-form";
import { Text, View } from "react-native";
import useDynamicMetricInput from "../../hooks/useDynamicMetricInput";

export default function BloodPressureField() {
  const { control, clearErrors } = useFormContext();
  /* const setValueHandler = useCallback(
    (type: "systolic" | "diastolic", value: number) => {
      const old = getValues("value") || {};
      setValue("value", {
        ...old,
        [type]: value,
      });
    },
    [setValue, getValues]
  );

  useEffect(() => {
    setValue("_blood_pressure_systolic", "");
    setValue("_blood_pressure_diastolic", "");
  }, [setValue]);

  const mode = watch("mode");
  useEffect(() => {
    if (mode === "edit") {
      const value = getValues("value");
      setValue("_blood_pressure_systolic", value?.systolic.toString() || "");
      setValue("_blood_pressure_diastolic", value?.diastolic.toString() || "");
    }
  }, [mode, setValue, getValues]); */

  const { setValueHandler } = useDynamicMetricInput({ type: "blood_pressure" });

  return (
    <>
      <Controller
        name="_blood_pressure_systolic"
        control={control}
        render={({ field }) => {
          const { value, onChange } = field;
          return (
            <View className="mb-4 flex flex-row gap-3 align-center justify-between">
              <View className="flex align-middle">
                <Text>Huyết áp tâm thu</Text>
              </View>
              <Input
                placeholder="mmHg"
                keyboardType="numeric"
                value={value}
                onChangeText={(x) => {
                  clearErrors();
                  onChange(x);
                  setValueHandler({ input: "_blood_pressure_systolic", value: x });
                }}
                containerStyle={{ width: 100 }}
              />
            </View>
          );
        }}
      />
      <Controller
        name="_blood_pressure_diastolic"
        control={control}
        render={({ field }) => {
          const { value, onChange } = field;
          return (
            <View className="mb-4 flex flex-row gap-3 align-center justify-between">
              <View className="flex align-middle">
                <Text>Huyết áp tâm trương</Text>
              </View>
              <Input
                placeholder="mmHg"
                keyboardType="numeric"
                value={value}
                onChangeText={(x) => {
                  clearErrors();
                  onChange(x);
                  setValueHandler({ input: "_blood_pressure_diastolic", value: x });
                }}
                containerStyle={{ width: 100 }}
              />
            </View>
          );
        }}
      />
    </>
  );
}
