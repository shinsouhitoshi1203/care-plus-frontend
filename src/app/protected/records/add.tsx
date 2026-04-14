import FullSize from "@/components/buttons/FullSize";
import { styles } from "@/components/input/style";
import Error from "@/components/message/Error";
import { HealthRecordProps, RecordAPI } from "@/features/record/api";
import FullSizeDropdownComponent from "@/features/record/component/dropdown/variants/FullSize";
import InputDynamicLayout from "@/features/record/layouts/InputDynamic";
import { healthMetrics, healthMetricsMap, healthMetricsOptions } from "@/features/record/options/metric";
import { healthRecordSchema } from "@/features/record/schema";
import useSubPageTitle from "@/hooks/useSubPageTitle";
import useZustandStore from "@/stores/zustand";
import { zodResolver } from "@hookform/resolvers/zod";
import { Input } from "@rneui/themed";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { AxiosError } from "axios";
import { useRouter } from "expo-router";
import { useCallback, useEffect } from "react";
import { Controller, FormProvider, useForm } from "react-hook-form";
import { Text, View } from "react-native";

// Tạm thời set cứng để test giao diện, sau này sẽ thay bằng id thật
const memberID = "b27dd5b7-a0e6-4d90-9b21-595af766f005";
const familyID = "ec833f94-21eb-42e8-b510-84a325b2fe53";

export default function AddRecordPage() {
  const router = useRouter();
  const queryClient = useQueryClient();

  useSubPageTitle("Thêm hồ sơ sức khỏe");

  const methods = useForm({
    defaultValues: {
      type: "blood_pressure",
      unit: "mmHg",
    },
    resolver: zodResolver(healthRecordSchema),
  });

  const {
    control,
    watch,
    setValue,
    handleSubmit,
    formState: { errors },
    setError,
  } = methods;
  const watchType = watch("type");

  useEffect(() => {
    console.log(watchType);
    const metric: any = healthMetricsMap[watchType];
    setValue("unit", metric?.unit);
  }, [watchType, setValue]);

  const setLoading = useZustandStore((state) => state.setLoading);
  const { mutate } = useMutation({
    mutationKey: ["health-records"],
    mutationFn: async (data: Partial<HealthRecordProps>) => {
      await RecordAPI.createHealthRecord(data as HealthRecordProps);
    },
    onMutate: () => {
      setLoading(true);
    },
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ["health-records"] });
      router.back();
    },
    onError: (error) => {
      if (error instanceof AxiosError && error.response?.status === 400) {
        // Handle specific error cases
        setError("root", { message: "Dữ liệu không hợp lệ. Vui lòng kiểm tra lại." });
        console.log(error.response?.data?.message);
      } else {
        setError("root", { message: "Đã có lỗi xảy ra. Vui lòng thử lại sau." });
      }
    },
    onSettled: () => {
      setLoading(false);
    },
  });

  const handleSave = useCallback(
    (data: Partial<HealthRecordProps>) => {
      const { type, value, note, unit } = data;
      const payload = {
        // hardcode tạm thời, sau này sẽ lấy từ context/auth
        memberID,
        familyID,

        // record
        type,
        value,
        note,
        unit,
      };
      console.log(payload);
      mutate(payload);
    },
    [mutate]
  );
  return (
    <>
      <View className="flex-1 gap-4">
        <View className="gap-4">
          <Controller
            name="type"
            control={control}
            render={({ field, fieldState: { error } }) => {
              const { onChange } = field;
              return (
                <View>
                  <Text className="mb-2">Chọn chỉ số sức khỏe</Text>
                  <FullSizeDropdownComponent
                    data={healthMetricsOptions}
                    defaultValue={healthMetrics[0]}
                    onChange={({ value }) => {
                      onChange(value);
                    }}
                  />
                </View>
              );
            }}
          />
          {errors.value && <Error.Block text={"Giá trị nhập vào không hợp lệ"} />}
          {errors.root && <Error.Block text={errors.root.message} />}
          <FormProvider {...methods}>
            <InputDynamicLayout />
          </FormProvider>
          <Controller
            name="note"
            control={control}
            render={({ field, fieldState: { error } }) => {
              const { value, onChange } = field;
              return (
                <View>
                  <Text className="mb-2">Ghi chú</Text>
                  <Input
                    containerStyle={styles.inputWrapper}
                    inputContainerStyle={styles.inputContainer}
                    inputStyle={styles.inputText}
                    onChangeText={onChange}
                    defaultValue={value}
                  />
                </View>
              );
            }}
          />
        </View>

        <FullSize title="Lưu hồ sơ" onPress={handleSubmit(handleSave)} />
      </View>
    </>
  );
}
