import { Input } from "@rneui/themed";
import { Controller, useFormContext } from "react-hook-form";
import useDynamicMetricInput from "../../hooks/useDynamicMetricInput";

export default function WeightField() {
  const { control, clearErrors } = useFormContext();

  const { setValueHandler } = useDynamicMetricInput({
    type: "weight",
  });

  return (
    <Controller
      name="_weight"
      control={control}
      render={({ field, fieldState }) => {
        const { value, onChange } = field;
        return (
          <>
            <Input
              placeholder="Nhập cân nặng"
              keyboardType="numeric"
              value={value}
              onChangeText={(x) => {
                clearErrors();
                onChange(x);
                setValueHandler({ value: x });
              }}
            />
          </>
        );
      }}
    />
  );
}
