import FullSize from "@/components/buttons/FullSize";
import { styles } from "@/components/input/style";
import Error from "@/components/message/Error";
import { HealthRecordProps, RecordAPI } from "@/features/record/api";
import FullSizeDropdownComponent from "@/features/record/component/dropdown/variants/FullSize";
import useFamily from "@/features/record/hooks/useFamily";
import InputDynamicLayout from "@/features/record/layouts/InputDynamic";
import { healthMetrics, healthMetricsMap, healthMetricsOptions } from "@/features/record/options/metric";
import { healthRecordSchema } from "@/features/record/schema";
import FamilyAPI from "@/features/family/api";
import useSubPageTitle from "@/hooks/useSubPageTitle";
import useZustandStore from "@/stores/zustand";
import { zodResolver } from "@hookform/resolvers/zod";
import { Input } from "@rneui/themed";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { AxiosError } from "axios";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useCallback, useEffect, useMemo, useState } from "react";
import { Controller, FormProvider, useForm } from "react-hook-form";
import { Text, View } from "react-native";

export default function AddRecordPage() {
  const router = useRouter();
  const queryClient = useQueryClient();
  const setLoading = useZustandStore((state) => state.setLoading);
  const { memberID, isOwner, familyId } = useFamily();
  const { targetMemberId } = useLocalSearchParams<{ targetMemberId?: string }>();
  useSubPageTitle("Thêm hồ sơ sức khỏe");

  // Member được chọn (tách riêng khỏi form vì zod schema không có field này)
  const defaultMemberID = targetMemberId || memberID;
  const [selectedMemberID, setSelectedMemberID] = useState<string | undefined>(defaultMemberID);

  // Cập nhật khi defaultMemberID load xong (async)
  useEffect(() => {
    if (defaultMemberID && !selectedMemberID) {
      setSelectedMemberID(defaultMemberID);
    }
  }, [defaultMemberID, selectedMemberID]);

  // Load danh sách members nếu user là OWNER (để chọn tạo record cho ai)
  const { data: familyMembers = [] } = useQuery({
    queryKey: ["family-members-for-record", familyId],
    queryFn: () => FamilyAPI.getMembers(familyId as string),
    enabled: Boolean(isOwner && familyId),
  });

  // Tạo options cho dropdown chọn member
  const memberOptions = useMemo(() => {
    if (!isOwner || familyMembers.length === 0) return [];
    return familyMembers.map((m: any) => ({
      label: m.full_name || "Chưa đặt tên",
      // Dùng user_id cho member có tài khoản (tương thích record cũ), member_id cho guest
      value: m.user_id || m.member_id || m.id,
    }));
  }, [isOwner, familyMembers]);

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
    const input = healthMetricsMap[watchType]?.inputName;
    if (Array.isArray(input)) {
      input.forEach((name) => {
        setValue(name, "");
      });
    } else {
      setValue(input, "");
    }
  }, [watchType, setValue]);

  useEffect(() => {
    const metric: any = healthMetricsMap[watchType];
    setValue("unit", metric?.unit);
  }, [watchType, setValue]);

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
        memberID: selectedMemberID || defaultMemberID,
        type,
        value,
        note,
        unit,
      };
      mutate(payload);
    },
    [mutate, selectedMemberID, defaultMemberID]
  );
  return (
    <>
      <View className="flex-1 gap-4">
        <View className="gap-4">
          {/* Dropdown chọn thành viên (chỉ hiện khi OWNER) */}
          {isOwner && memberOptions.length > 0 && (
            <View>
              <Text className="mb-2">Tạo hồ sơ cho</Text>
              <FullSizeDropdownComponent
                data={memberOptions}
                defaultValue={selectedMemberID}
                placeholderText="Chọn thành viên"
                onChange={({ value }: any) => {
                  setSelectedMemberID(value);
                }}
              />
            </View>
          )}

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
          {errors.value && <Error.Block text={errors.value.message} />}
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


