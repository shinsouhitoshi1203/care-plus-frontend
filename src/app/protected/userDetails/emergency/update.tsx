import Error from "@/components/message/Error";
import EmergencyUpdateForm from "@/features/emergency/update/components/EmergencyUpdateForm";
import MemberSelector from "@/features/emergency/update/components/MemberSelector";
import {
  buildInitialEmergencyDrafts,
  cloneEmergencyDraft,
  EMERGENCY_MEMBER_MOCKS,
  EMERGENCY_MEMBER_OPTIONS,
  EMPTY_EMERGENCY_DRAFT,
} from "@/features/emergency/update/constants";
import { emergencyUpdateFormSchema } from "@/features/emergency/update/schema";
import { type EmergencyFormValues } from "@/features/emergency/update/types";
import { sanitizeEmergencyFormValues } from "@/features/emergency/update/utils";
import useSubPageTitle from "@/hooks/useSubPageTitle";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@rneui/themed";
import { useQueryClient } from "@tanstack/react-query";
import { useRouter } from "expo-router";
import { Save, X } from "lucide-react-native";
import { useCallback, useMemo, useState } from "react";
import { FormProvider, useForm } from "react-hook-form";
import { Alert, KeyboardAvoidingView, Platform, ScrollView, Text, View } from "react-native";

export default function UpdateEmergencyInfoPage() {
  useSubPageTitle("Cập nhật thông tin khẩn cấp");
  const router = useRouter();

  const seedDrafts = useMemo(() => buildInitialEmergencyDrafts(), []);
  const [selectedMemberId, setSelectedMemberId] = useState<string>(EMERGENCY_MEMBER_OPTIONS[0]?.value || "");
  const [draftsByMember, setDraftsByMember] = useState<Record<string, EmergencyFormValues>>(seedDrafts);
  const queryClient = useQueryClient();
  const methods = useForm<EmergencyFormValues>({
    resolver: zodResolver(emergencyUpdateFormSchema),
    defaultValues: cloneEmergencyDraft(draftsByMember[selectedMemberId] || EMPTY_EMERGENCY_DRAFT),
    reValidateMode: "onChange",
  });

  const {
    handleSubmit,
    getValues,
    reset,
    setError,
    clearErrors,
    formState: { errors, isSubmitting },
  } = methods;

  const selectedMember = useMemo(
    () => EMERGENCY_MEMBER_MOCKS.find((member) => member.member_id === selectedMemberId),
    [selectedMemberId]
  );

  const saveCurrentMemberDraft = useCallback(
    (memberId: string) => {
      if (!memberId) return;
      const normalizedDraft = sanitizeEmergencyFormValues(getValues());
      setDraftsByMember((prev) => ({
        ...prev,
        [memberId]: normalizedDraft,
      }));
    },
    [getValues]
  );

  const handleMemberChange = useCallback(
    (nextMemberId: string) => {
      if (!nextMemberId || nextMemberId === selectedMemberId) return;

      clearErrors();
      saveCurrentMemberDraft(selectedMemberId);

      const nextDraft = draftsByMember[nextMemberId] || seedDrafts[nextMemberId] || EMPTY_EMERGENCY_DRAFT;
      setSelectedMemberId(nextMemberId);
      reset(cloneEmergencyDraft(nextDraft));
    },
    [clearErrors, draftsByMember, reset, saveCurrentMemberDraft, seedDrafts, selectedMemberId]
  );

  const handleSaveTemporary = useCallback(
    (values: EmergencyFormValues) => {
      if (!selectedMemberId) {
        setError("root", {
          type: "manual",
          message: "Không tìm thấy thành viên để cập nhật.",
        });
        return;
      }

      const normalizedValues = sanitizeEmergencyFormValues(values);
      setDraftsByMember((prev) => ({
        ...prev,
        [selectedMemberId]: normalizedValues,
      }));

      reset(cloneEmergencyDraft(normalizedValues));

      Alert.alert(
        "Đã lưu tạm trên giao diện",
        `Thông tin khẩn cấp của ${selectedMember?.full_name || "thành viên"} đã được lưu trong state cục bộ.`
      );
    },
    [reset, selectedMember, selectedMemberId, setError]
  );

  const handleCancel = useCallback(() => {
    queryClient.invalidateQueries({ queryKey: ["emergency_public_info"] });
    router.back();
  }, [router, queryClient]);

  return (
    <KeyboardAvoidingView
      className="flex-1 bg-slate-100"
      behavior={Platform.select({ ios: "padding", default: undefined })}
      keyboardVerticalOffset={24}
    >
      <ScrollView contentContainerStyle={{ padding: 16, paddingBottom: 32, gap: 14 }}>
        <View className="rounded-3xl bg-teal-700 p-5">
          <Text className="text-xl font-extrabold text-white">Biểu mẫu khẩn cấp cho gia đình</Text>
          <Text className="mt-2 text-sm leading-5 text-teal-50">
            Màn hình này đang dùng dữ liệu giả lập. Bạn có thể chuyển từng thành viên để cập nhật bộ thông tin riêng.
          </Text>

          <View className="mt-4 rounded-2xl border border-teal-500 bg-teal-600 px-3 py-3">
            <Text className="text-xs text-teal-100">Đang chỉnh sửa cho</Text>
            <Text className="mt-1 text-lg font-bold text-white">
              {selectedMember?.full_name || "Chưa chọn thành viên"}
            </Text>
          </View>
        </View>

        {typeof errors.root?.message === "string" ? <Error.Block text={errors.root.message} /> : null}

        <FormProvider {...methods}>
          <MemberSelector
            options={EMERGENCY_MEMBER_OPTIONS}
            value={selectedMemberId}
            onChange={handleMemberChange}
            activeMember={selectedMember}
          />
          <EmergencyUpdateForm />
        </FormProvider>

        <View className="flex-row gap-3">
          <Button
            type="solid"
            title={isSubmitting ? "Đang lưu..." : "Lưu"}
            icon={<Save size={26} color="#FFFFFF" />}
            iconContainerStyle={{ marginRight: 16 }}
            disabled={isSubmitting}
            onPress={handleSubmit(handleSaveTemporary)}
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

        <Text className="text-center text-xs italic text-slate-500">
          Chưa gắn API. Dữ liệu hiện chỉ được giữ trong state của màn hình.
        </Text>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}
