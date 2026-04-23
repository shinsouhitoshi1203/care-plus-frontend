import { Button, Input } from "@rneui/themed";
import { Plus, Trash2, Users } from "lucide-react-native";
import { Controller, useFieldArray, useFormContext } from "react-hook-form";
import { Text, View } from "react-native";
import { EMPTY_CONTACT } from "../constants";
import { type EmergencyFormValues } from "../types";

export default function EmergencyContactSection() {
  const {
    control,
    formState: { errors },
  } = useFormContext<EmergencyFormValues>();

  const { fields, append, remove } = useFieldArray({
    control,
    name: "emergency_contacts",
  });

  const contactListError =
    errors.emergency_contacts && !Array.isArray(errors.emergency_contacts)
      ? errors.emergency_contacts.message
      : undefined;

  return (
    <View className="rounded-2xl border border-indigo-200 bg-indigo-50 p-4">
      <View className="flex-row items-center justify-between">
        <View className="flex-row items-center gap-2">
          <Users size={18} color="#4338CA" />
          <Text className="text-base font-semibold text-indigo-800">Liên hệ khẩn cấp</Text>
        </View>

        <Button
          type="clear"
          title="Thêm"
          icon={<Plus size={16} color="#4338CA" />}
          titleStyle={{ color: "#4338CA", fontWeight: "700", fontSize: 13 }}
          onPress={() => append({ ...EMPTY_CONTACT })}
        />
      </View>

      <Text className="mt-1 text-xs text-indigo-700">
        Cần ít nhất một người thân có thể liên hệ nhanh khi xảy ra tình huống khẩn cấp.
      </Text>

      {fields.map((field, index) => {
        return (
          <View key={field.id} className="mt-3 rounded-2xl border border-indigo-100 bg-white p-3">
            <View className="mb-1 flex-row items-center justify-between">
              <Text className="font-semibold text-slate-800">Liên hệ #{index + 1}</Text>
              {fields.length > 1 ? (
                <Button
                  type="clear"
                  title="Xóa"
                  icon={<Trash2 size={14} color="#DC2626" />}
                  titleStyle={{ color: "#DC2626", fontSize: 12, fontWeight: "700" }}
                  onPress={() => remove(index)}
                />
              ) : null}
            </View>

            <Controller
              control={control}
              name={`emergency_contacts.${index}.name`}
              render={({ field: inputField, fieldState }) => (
                <View>
                  <Input
                    label="Họ tên"
                    placeholder="Ví dụ: Nguyễn Văn A"
                    value={inputField.value}
                    onChangeText={inputField.onChange}
                    renderErrorMessage={false}
                    containerStyle={{ paddingHorizontal: 0, marginBottom: 2 }}
                    labelStyle={{ color: "#475569", fontSize: 12, marginBottom: 6 }}
                    inputContainerStyle={{
                      borderBottomWidth: 0,
                      borderWidth: 1,
                      borderColor: "#CBD5E1",
                      borderRadius: 12,
                      minHeight: 42,
                      backgroundColor: "#F8FAFC",
                      paddingHorizontal: 12,
                    }}
                    inputStyle={{ color: "#0F172A", fontSize: 14 }}
                    placeholderTextColor="#94A3B8"
                  />
                  {fieldState.error?.message ? (
                    <Text className="mt-1 text-xs text-rose-600">{fieldState.error.message}</Text>
                  ) : null}
                </View>
              )}
            />

            <Controller
              control={control}
              name={`emergency_contacts.${index}.relationship`}
              render={({ field: inputField, fieldState }) => (
                <View>
                  <Input
                    label="Mối quan hệ"
                    placeholder="Ví dụ: Con trai"
                    value={inputField.value}
                    onChangeText={inputField.onChange}
                    renderErrorMessage={false}
                    containerStyle={{ paddingHorizontal: 0, marginBottom: 2 }}
                    labelStyle={{ color: "#475569", fontSize: 12, marginBottom: 6 }}
                    inputContainerStyle={{
                      borderBottomWidth: 0,
                      borderWidth: 1,
                      borderColor: "#CBD5E1",
                      borderRadius: 12,
                      minHeight: 42,
                      backgroundColor: "#F8FAFC",
                      paddingHorizontal: 12,
                    }}
                    inputStyle={{ color: "#0F172A", fontSize: 14 }}
                    placeholderTextColor="#94A3B8"
                  />
                  {fieldState.error?.message ? (
                    <Text className="mt-1 text-xs text-rose-600">{fieldState.error.message}</Text>
                  ) : null}
                </View>
              )}
            />

            <Controller
              control={control}
              name={`emergency_contacts.${index}.phone`}
              render={({ field: inputField, fieldState }) => (
                <View>
                  <Input
                    label="Số điện thoại"
                    placeholder="Ví dụ: 0901234567"
                    value={inputField.value}
                    onChangeText={inputField.onChange}
                    keyboardType="phone-pad"
                    renderErrorMessage={false}
                    containerStyle={{ paddingHorizontal: 0, marginBottom: 2 }}
                    labelStyle={{ color: "#475569", fontSize: 12, marginBottom: 6 }}
                    inputContainerStyle={{
                      borderBottomWidth: 0,
                      borderWidth: 1,
                      borderColor: "#CBD5E1",
                      borderRadius: 12,
                      minHeight: 42,
                      backgroundColor: "#F8FAFC",
                      paddingHorizontal: 12,
                    }}
                    inputStyle={{ color: "#0F172A", fontSize: 14 }}
                    placeholderTextColor="#94A3B8"
                  />
                  {fieldState.error?.message ? (
                    <Text className="mt-1 text-xs text-rose-600">{fieldState.error.message}</Text>
                  ) : null}
                </View>
              )}
            />
          </View>
        );
      })}

      {typeof contactListError === "string" ? (
        <Text className="mt-2 text-xs text-rose-600">{contactListError}</Text>
      ) : null}
    </View>
  );
}
