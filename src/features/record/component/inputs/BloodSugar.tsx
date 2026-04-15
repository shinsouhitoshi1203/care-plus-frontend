import { Input } from "@rneui/themed";
import { Controller, useFormContext } from "react-hook-form";
import useDynamicMetricInput from "../../hooks/useDynamicMetricInput";

export default function BloodSugarField() {
  const { control, clearErrors } = useFormContext();
  const { setValueHandler } = useDynamicMetricInput({ type: "blood_sugar" });

  return (
    <Controller
      name="_blood_sugar"
      control={control}
      render={({ field }) => {
        const { value, onChange } = field;
        return (
          <Input
            placeholder="Nhập đường huyết"
            keyboardType="numeric"
            value={value}
            onChangeText={(x) => {
              clearErrors();
              onChange(x);
              setValueHandler({ value: x });
            }}
          />
        );
      }}
    />
  );
}
