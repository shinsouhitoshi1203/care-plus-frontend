import { Button, Input } from "@rneui/themed";
import { Plus, X } from "lucide-react-native";
import { useState } from "react";
import { Controller, type Control } from "react-hook-form";
import { Pressable, ScrollView, Text, View } from "react-native";
import { type EmergencyFormValues } from "../types";

type TagArrayFieldName = "allergies" | "chronic_diseases" | "current_medications";

interface TagArrayFieldProps {
  control: Control<EmergencyFormValues>;
  name: TagArrayFieldName;
  label: string;
  placeholder: string;
  hint?: string;
  suggestions?: string[];
  accentColor?: string;
}

export default function TagArrayField({
  control,
  name,
  label,
  placeholder,
  hint,
  suggestions = [],
  accentColor = "#0F766E",
}: TagArrayFieldProps) {
  const [inputValue, setInputValue] = useState("");

  return (
    <Controller
      control={control}
      name={name}
      render={({ field, fieldState }) => {
        const values = Array.isArray(field.value) ? field.value : [];

        const addTag = (rawValue: string) => {
          const nextValue = rawValue.trim();
          if (!nextValue) return;
          if (values.some((item) => item.toLowerCase() === nextValue.toLowerCase())) {
            setInputValue("");
            return;
          }

          field.onChange([...values, nextValue]);
          setInputValue("");
        };

        const removeTag = (tagValue: string) => {
          field.onChange(values.filter((item) => item !== tagValue));
        };

        return (
          <View
            className="rounded-2xl border p-4"
            style={{
              borderColor: `${accentColor}44`,
              backgroundColor: `${accentColor}10`,
            }}
          >
            <Text className="text-base font-semibold text-slate-900">{label}</Text>
            {hint ? <Text className="mt-1 text-xs text-slate-500">{hint}</Text> : null}

            <View className="mt-3 flex-row items-end gap-2">
              <View className="flex-1">
                <Input
                  value={inputValue}
                  onChangeText={setInputValue}
                  onSubmitEditing={() => addTag(inputValue)}
                  placeholder={placeholder}
                  renderErrorMessage={false}
                  containerStyle={{ paddingHorizontal: 0, marginBottom: 0 }}
                  inputContainerStyle={{
                    borderBottomWidth: 0,
                    backgroundColor: "#FFFFFF",
                    borderWidth: 1,
                    borderColor: "#CBD5E1",
                    borderRadius: 12,
                    minHeight: 44,
                    paddingHorizontal: 12,
                  }}
                  inputStyle={{ fontSize: 14, color: "#0F172A" }}
                  placeholderTextColor="#94A3B8"
                />
              </View>
              <Button
                title="Thêm"
                type="outline"
                icon={<Plus size={16} color={accentColor} />}
                buttonStyle={{ borderColor: accentColor, borderRadius: 12, minHeight: 42, paddingHorizontal: 12 }}
                titleStyle={{ color: accentColor, fontSize: 13, fontWeight: "600" }}
                onPress={() => addTag(inputValue)}
              />
            </View>

            {suggestions.length > 0 ? (
              <View
                className="mt-2 rounded-xl border px-3 py-2"
                style={{
                  borderColor: `${accentColor}55`,
                  backgroundColor: `${accentColor}14`,
                }}
              >
                <View className="mb-2 flex-row items-center gap-2">
                  <Text style={{ color: accentColor, fontSize: 12, fontWeight: "700" }}>Gợi ý:</Text>
                  <Text className="text-xs text-slate-600">Chạm để thêm nhanh</Text>
                </View>

                <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                  <View className="flex-row gap-2 pb-1">
                    {suggestions.map((item) => (
                      <Pressable
                        key={item}
                        className="rounded-full border bg-white px-3 py-1.5"
                        style={{ borderColor: `${accentColor}66` }}
                        onPress={() => addTag(item)}
                      >
                        <Text style={{ color: accentColor, fontSize: 12, fontWeight: "600" }}>+ {item}</Text>
                      </Pressable>
                    ))}
                  </View>
                </ScrollView>
              </View>
            ) : null}

            <View className="mt-3 flex-row flex-wrap gap-2">
              {values.length > 0 ? (
                values.map((item, index) => (
                  <Pressable
                    key={`${item}-${index}`}
                    className="flex-row items-center gap-1 rounded-full border border-slate-300 bg-white px-3 py-1.5"
                    onPress={() => removeTag(item)}
                  >
                    <Text className="text-xs font-semibold text-slate-700">{item}</Text>
                    <X size={12} color="#475569" />
                  </Pressable>
                ))
              ) : (
                <Text className="text-xs italic text-slate-500">Chưa có dữ liệu</Text>
              )}
            </View>

            {fieldState.error?.message ? (
              <Text className="mt-2 text-xs text-rose-600">{fieldState.error.message}</Text>
            ) : null}
          </View>
        );
      }}
    />
  );
}
