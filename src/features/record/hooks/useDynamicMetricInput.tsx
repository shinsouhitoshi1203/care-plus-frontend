import { removeNotNumber } from "@/utils/number";
import { useCallback, useEffect, useRef } from "react";
import { useFormContext } from "react-hook-form";
import { healthMetricsMap } from "../options/metric";

export default function useDynamicMetricInput({ type }: { type: string }) {
  const resetRef = useRef(false);
  const {
    setValue,
    getValues,
    watch,
    setError,
    formState: { isSubmitting },
  } = useFormContext();
  const setValueHandler = useCallback(
    ({ input = "_", value }: { input?: string; value: string }) => {
      const old = getValues("value") || {};
      const part = input !== "_" ? input.split("_").slice(-1)[0] : "_";
      const parsedValue = removeNotNumber(value);
      // console.log("PARSED VALUE", parsedValue, value, parseFloat(value));
      if (parsedValue !== parseFloat(value)) {
        setError("value", {
          type: "manual",
          message:
            "Giá trị không hợp lệ. Hãy đảm bảo số nhập vào là số hợp lệ, sử dụng dấu chấm (.) để phân tách phần thập phân",
        });
      }

      setValue("value", {
        ...old,
        [part]: parsedValue,
      });
    },
    [setValue, getValues, setError]
  );

  const mode = watch("mode");
  useEffect(() => {
    const inputList = healthMetricsMap[type].inputName;
    if (mode === "edit" && !resetRef.current) {
      resetRef.current = true;
      if (Array.isArray(inputList)) {
        inputList.forEach((input) => {
          const part = input.split("_").slice(-1)[0];
          const value = getValues("value")?.[part]?.toString() || "";
          setValue(input, value);
        });
      } else {
        const value = getValues("value")?._?.toString() || "";
        setValue(inputList, value);
      }
    } else if (!resetRef.current) {
      resetRef.current = true;
      if (Array.isArray(inputList)) {
        inputList.forEach((subField) => {
          // const part = input.split("_").slice(-1)[0];
          const value = "";
          setValue(subField, value);
        });
      } else {
        const value = "";
        setValue(inputList, value);
      }
    }
  }, [type, mode, setValue, getValues]);

  useEffect(() => {
    if (isSubmitting) {
      console.log("SUBMITTED", getValues());
      // Enforce the parsed value
      resetRef.current = false;
      const inputList = healthMetricsMap[type].inputName;
      if (Array.isArray(inputList)) {
        inputList.forEach((subField) => {
          const part = subField.split("_").slice(-1)[0];
          const value = getValues("value")?.[part]?.toString() || "";
          setValue(subField, value);
        });
      } else {
        const value = getValues("value")?._?.toString() || "";
        setValue(inputList, value);
      }
    }
  }, [setValue, isSubmitting, getValues, type]);

  return { setValueHandler };
}
