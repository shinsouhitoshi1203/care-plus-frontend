import FullSize from "@/components/buttons/FullSize";
import ControlledInput from "@/components/input/ControlledInput";
import Error from "@/components/message/Error";
import { RecordAPI } from "@/features/record/api";
import InputDynamicLayout from "@/features/record/layouts/InputDynamic";
import { healthMetricsMap } from "@/features/record/options/metric";
import { EditHealthRecordProps, editHealthRecordSchema, hardcodedID } from "@/features/record/schema";
import useSubPageTitle from "@/hooks/useSubPageTitle";
import useZustandStore from "@/stores/zustand";
import { formatDateTime } from "@/utils/datetime";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { AxiosError } from "axios";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useCallback, useMemo, useRef } from "react";
import { FormProvider, useForm } from "react-hook-form";
import { Alert, KeyboardAvoidingView, Text, View } from "react-native";
export default function EditRecordByIDPage() {
  useSubPageTitle("Chỉnh sửa thông tin");
  // TODO: Implement block edit record by id, using middleware to check if user is authorized to edit the record
  const recordRef = useRef({ updated_at: "" });
  const setLoading = useZustandStore((state) => state.setLoading);
  const router = useRouter();
  const queryClient = useQueryClient();
  const { recordID } = useLocalSearchParams() as { recordID: string };
  const method = useForm({
    defaultValues: async () => {
      const { type, value, note, updated_at } = await RecordAPI.getHealthRecordFromLocal(recordID);
      recordRef.current = {
        updated_at,
      };

      const input = healthMetricsMap[type]?.inputName;
      if (Array.isArray(input)) {
        const inputValues: Record<string, any> = {};
        input.forEach((name) => {
          const part = name.split("_").slice(-1).toString();
          inputValues[name] = value?.[part];
        });
        return { type, note, mode: "edit", value, ...inputValues } as EditHealthRecordProps;
      } else {
        return { type, note, mode: "edit", value, [input]: value?._ } as EditHealthRecordProps;
      }

      // return { type, value, note, mode: "edit" } as EditHealthRecordProps;
    },
    resolver: zodResolver(editHealthRecordSchema),
  });
  const {
    watch,
    control,
    handleSubmit,
    setError,
    formState: { errors },
  } = method;
  const watchType = watch("type");
  const displayType = useMemo(() => {
    return healthMetricsMap[watchType]?.label.toLowerCase() || "chỉ số sức khỏe";
  }, [watchType]);

  const { mutate } = useMutation({
    mutationKey: ["health-records"],
    mutationFn: async (data: EditHealthRecordProps) => {
      await RecordAPI.updateHealthRecord(recordID, {
        ...data,
        ...hardcodedID,
      });
    },
    onMutate: () => {
      setLoading(true);
    },
    onSuccess: async () => {
      // Invalidate and refetch
      await queryClient.invalidateQueries({ queryKey: ["health-records"] });
      router.back();
    },
    onError: (error) => {
      if (error instanceof AxiosError && error.response?.status === 403) {
        setError("value", { message: error.response.data.message });
      } else if (error instanceof AxiosError && error.response?.status === 404) {
        Alert.alert("Lỗi", "Không tìm thấy hồ sơ sức khỏe. Có thể đã bị xóa hoặc không tồn tại.");
        router.back();
      } else if (error instanceof AxiosError && error.code === "ERR_NETWORK") {
        setError("root", { message: "Không thể cập nhật thông tin" });
      } else {
        setError("root", { message: "Có lỗi xảy ra khi cập nhật hồ sơ sức khỏe. Vui lòng thử lại." });
      }
    },
    onSettled: () => {
      setLoading(false);
    },
  });
  const editHandler = useCallback(
    (x: EditHealthRecordProps) => {
      mutate(x);
    },
    [mutate]
  );
  return (
    <View>
      <Text>Chỉnh sửa giá trị đo của {displayType}</Text>
      <Text>
        Thời gian ghi nhận <Text className="font-bold">{formatDateTime(recordRef.current.updated_at)}</Text>
      </Text>
      <KeyboardAvoidingView>
        <View className="my-4 gap-4">
          {errors.value && <Error.Block text={errors.value.message} />}
          <FormProvider {...method}>
            <InputDynamicLayout />
          </FormProvider>
          <ControlledInput name="note" label="Ghi chú" control={control} />
          <FullSize title="Lưu thay đổi" onPress={handleSubmit(editHandler)} />
        </View>
      </KeyboardAvoidingView>
    </View>
  );
}
