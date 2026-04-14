import { Input } from "@rneui/themed";
import { useCallback, useEffect } from "react";
import { Controller, useFormContext } from "react-hook-form";

export default function BloodSugarField() {
  const { control, setValue, clearErrors } = useFormContext();
  const setValueHandler = useCallback(
    (value: number) => {
      setValue("value", { _: value });
    },
    [setValue]
  );

  useEffect(() => {
    setValue("_blood_sugar", "");
  }, [setValue]);
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
              onChange(Number.parseFloat(x));
              setValueHandler(Number.parseFloat(x));
            }}
          />
        );
      }}
    />
  );
}
