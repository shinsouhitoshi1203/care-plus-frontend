import Error from "@/components/message/Error";
import { upsertEmergencyInfo } from "@/features/emergency/api";
import useEmergencyInfo from "@/features/emergency/hooks/useEmergencyInfo";
import EmergencyUpdateForm from "@/features/emergency/update/components/EmergencyUpdateForm";
import { type EmergencyFormValues } from "@/features/emergency/update/types";
import withWaitFallback from "@/hocs/withWaitFallback";
import useZustandStore from "@/stores/zustand";
import { Button, Skeleton } from "@rneui/themed";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useRouter } from "expo-router";
import { Save, X } from "lucide-react-native";
import { useCallback } from "react";
import { FormProvider, useForm } from "react-hook-form";
import { Alert, KeyboardAvoidingView, Platform, ScrollView, Text, View } from "react-native";

function UpdateEmergencyInfoPage() {
  const router = useRouter();
  const queryClient = useQueryClient();
  const setLoading = useZustandStore((state) => state.setLoading);
  const { mutate } = useMutation({
    mutationKey: ["emergency_public_info"],
    mutationFn: async (values: EmergencyFormValues & { sections: string[] }) => {
      const { sections, ..._ } = values;
      await upsertEmergencyInfo(_);
    },
    onMutate: () => {
      setLoading(true);
    },
    onSuccess: async (_, data) => {
      const { sections, ...updated } = data as EmergencyFormValues & { sections: string[] };
      await queryClient.setQueryData(["emergency_public_info"], (oldData: any) => ({
        ...oldData,
        ...updated,
      }));
      // queryClient.invalidateQueries({ queryKey: ["emergency_public_info"] });
      // queryClient.removeQueries({ queryKey: ["emergency_public_id"] });
      router.back();
    },
    onError: () => {
      Alert.alert("Lỗi", "Có lỗi xảy ra khi cập nhật thông tin khẩn cấp. Vui lòng thử lại sau.");
    },
    onSettled: () => {
      setLoading(false);
    },
  });
  const { data, isLoading } = useEmergencyInfo();
  const methods = useForm({
    // resolver: zodResolver(emergencyUpdateFormSchema),
    defaultValues: data
      ? ({
          sections: [],
          ...data,
        } as EmergencyFormValues & { sections: string[] })
      : { sections: [] },
    reValidateMode: "onChange",
  });

  const {
    handleSubmit,
    formState: { errors, isSubmitting },
  } = methods;

  const handleSave = useCallback(
    (values) => {
      mutate(values);
    },
    [mutate]
  );

  const handleCancel = useCallback(() => {
    router.back();
  }, [router]);
  return (
    <KeyboardAvoidingView
      className="flex-1 bg-slate-100"
      behavior={Platform.select({ ios: "padding", default: undefined })}
      keyboardVerticalOffset={24}
    >
      <ScrollView contentContainerStyle={{ padding: 16, paddingBottom: 32, gap: 14 }}>
        <View className="rounded-3xl bg-teal-700 p-5">
          <Text className="text-xl font-extrabold text-white">Cập nhật thông tin khẩn cấp</Text>
          <Text className="mt-2 text-sm leading-5 text-teal-50">
            - Thông tin khẩn cấp sẽ được hiển thị công khai qua mã QR. Khi cần chỉ việc quét mã để cung cấp thông tin.
            {"\n"}- Hãy đảm bảo thông tin bạn cung cấp là chính xác và cập nhật để đảm bảo sự an toàn của bạn trong các
            tình huống khẩn cấp.
          </Text>
        </View>

        {typeof errors.root === "object" && errors.root !== null && <Error.Block text={errors.root.message} />}

        <FormProvider {...methods}>{!isLoading ? <EmergencyUpdateForm /> : <Skeleton height={150} />}</FormProvider>

        <View className="flex-row gap-3">
          <Button
            type="solid"
            title={isSubmitting ? "Đang lưu..." : "Lưu"}
            icon={<Save size={26} color="#FFFFFF" />}
            iconContainerStyle={{ marginRight: 16 }}
            disabled={isSubmitting}
            onPress={handleSubmit(handleSave)}
            containerStyle={{ flex: 1 }}
            buttonStyle={{ borderRadius: 14, minHeight: 52 }}
            titleStyle={{ marginLeft: 16, color: "#FFFFFF", fontWeight: "700", fontSize: 16 }}
          />
          <Button
            type="outline"
            title="Hủy"
            icon={<X size={26} color="#0F766E" />}
            iconContainerStyle={{ marginRight: 16 }}
            onPress={handleCancel}
            containerStyle={{ flex: 1 }}
            buttonStyle={{ borderColor: "#0F766E", borderRadius: 14, minHeight: 52 }}
            titleStyle={{ marginLeft: 16, color: "#0F766E", fontWeight: "700", fontSize: 16 }}
          />
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}
export default withWaitFallback(UpdateEmergencyInfoPage);
