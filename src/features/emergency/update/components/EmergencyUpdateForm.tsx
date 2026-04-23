import { AlertCircle, ChevronDown, ChevronUp, Droplets, Pill, Stethoscope, Users } from "lucide-react-native";
import type { ComponentType } from "react";
import { Controller, useFormContext, useWatch } from "react-hook-form";
import { Pressable, StyleSheet, Text, View } from "react-native";
import { Dropdown, MultiSelect } from "react-native-element-dropdown";
import {
  ALLERGY_SUGGESTIONS,
  BLOOD_TYPE_OPTIONS,
  CHRONIC_SUGGESTIONS,
  EMERGENCY_SECTION_OPTIONS,
  MEDICATION_SUGGESTIONS,
} from "../constants";
import { type EmergencyFormValues, type EmergencySectionKey } from "../types";
import EmergencyContactSection from "./EmergencyContactSection";
import TagArrayField from "./TagArrayField";

type EmergencySectionOption = (typeof EMERGENCY_SECTION_OPTIONS)[number];

const sectionVisualMap: Record<
  EmergencySectionKey,
  {
    icon: ComponentType<{ size?: number; color?: string }>;
    color: string;
    bg: string;
  }
> = {
  blood_type: {
    icon: Droplets,
    color: "#BE123C",
    bg: "#FFE4E6",
  },
  allergies: {
    icon: AlertCircle,
    color: "#B45309",
    bg: "#FEF3C7",
  },
  chronic_diseases: {
    icon: Stethoscope,
    color: "#0284C7",
    bg: "#E0F2FE",
  },
  current_medications: {
    icon: Pill,
    color: "#0F766E",
    bg: "#CCFBF1",
  },
  emergency_contacts: {
    icon: Users,
    color: "#4338CA",
    bg: "#E0E7FF",
  },
};

export default function EmergencyUpdateForm() {
  const {
    control,
    formState: { errors },
  } = useFormContext<EmergencyFormValues>();

  const selectedSections = useWatch({ control, name: "sections" }) || [];

  return (
    <View className="gap-4">
      <Controller
        control={control}
        name="sections"
        render={({ field }) => (
          <View className="rounded-2xl border border-slate-200 bg-white p-4">
            <Text className="text-base font-semibold text-slate-900">Mục thông tin cần cập nhật</Text>
            <Text className="mt-4 text-xs text-slate-500">
              Chọn các mục thông tin khẩn cấp mà bạn muốn cung cấp. Bấm vào các thẻ màu bên dưới để bỏ.
            </Text>
            <MultiSelect
              style={styles.select}
              data={EMERGENCY_SECTION_OPTIONS}
              value={field.value}
              mode="modal"
              labelField="label"
              valueField="value"
              placeholder="Chọn mục cần cập nhật"
              placeholderStyle={styles.placeholderStyle}
              itemTextStyle={styles.itemTextStyle}
              onChange={(nextValues) => field.onChange((nextValues || []) as EmergencySectionKey[])}
              renderItem={(item) => {
                const option = item as EmergencySectionOption;
                const visual = sectionVisualMap[option.value as EmergencySectionKey];
                const Icon = visual.icon;

                return (
                  <View className="flex-row items-center gap-3 px-2 py-2.5">
                    <View
                      className="h-12 w-12 items-center justify-center rounded-lg"
                      style={{ backgroundColor: visual.bg }}
                    >
                      <Icon size={24} color={visual.color} />
                    </View>
                    <Text className="text-lg font-medium text-slate-800">{option.label}</Text>
                  </View>
                );
              }}
              renderSelectedItem={(item, unSelect) => {
                const option = item as EmergencySectionOption;
                const visual = sectionVisualMap[option.value as EmergencySectionKey];
                const Icon = visual.icon;

                return (
                  <Pressable
                    className="mb-2 mr-2 flex-row items-center gap-1.5 rounded-full border px-2.5 py-1.5"
                    style={{
                      borderColor: `${visual.color}66`,
                      backgroundColor: `${visual.color}14`,
                    }}
                    onPress={() => {
                      if (typeof unSelect === "function") {
                        unSelect(option);
                      }
                    }}
                  >
                    <Icon size={13} color={visual.color} />
                    <Text style={{ color: visual.color, fontSize: 12, fontWeight: "700" }}>{option.label}</Text>
                  </Pressable>
                );
              }}
              renderRightIcon={(visible) =>
                visible ? <ChevronUp size={18} color="#334155" /> : <ChevronDown size={18} color="#334155" />
              }
            />

            {!Array.isArray(errors.sections) && typeof errors.sections?.message === "string" ? (
              <Text className="mt-2 text-xs text-rose-600">{errors.sections.message}</Text>
            ) : null}
          </View>
        )}
      />

      {selectedSections.includes("blood_type") ? (
        <Controller
          control={control}
          name="blood_type"
          render={({ field }) => (
            <View className="rounded-2xl border border-rose-200 bg-rose-50 p-4">
              <View className="flex-row items-center gap-2">
                <Droplets size={18} color="#BE123C" />
                <Text className="text-base font-semibold text-rose-700">Nhóm máu</Text>
              </View>

              <Dropdown
                style={styles.select}
                data={BLOOD_TYPE_OPTIONS}
                value={field.value}
                labelField="label"
                valueField="value"
                placeholder="Chọn nhóm máu"
                selectedTextStyle={styles.selectedTextStyle}
                placeholderStyle={styles.placeholderStyle}
                itemTextStyle={styles.itemTextStyle}
                onChange={(item) => field.onChange(item.value)}
                renderRightIcon={(visible) =>
                  visible ? <ChevronUp size={18} color="#334155" /> : <ChevronDown size={18} color="#334155" />
                }
              />

              {typeof errors.blood_type?.message === "string" ? (
                <Text className="mt-2 text-xs text-rose-600">{errors.blood_type.message}</Text>
              ) : null}
            </View>
          )}
        />
      ) : null}

      {selectedSections.includes("allergies") ? (
        <View>
          <TagArrayField
            control={control}
            name="allergies"
            label="Danh sách dị ứng"
            placeholder="Ví dụ: Penicillin"
            suggestions={ALLERGY_SUGGESTIONS}
            hint="Nhấn vào các thẻ màu để xóa mục đã nhập"
            accentColor="#D97706"
          />
        </View>
      ) : null}

      {selectedSections.includes("chronic_diseases") ? (
        <View>
          <TagArrayField
            control={control}
            name="chronic_diseases"
            label="Danh sách bệnh nền"
            placeholder="Ví dụ: Tăng huyết áp"
            suggestions={CHRONIC_SUGGESTIONS}
            hint="Nên nhập theo chuẩn chẩn đoán để dễ đối soát sau này"
            accentColor="#0284C7"
          />
        </View>
      ) : null}

      {selectedSections.includes("current_medications") ? (
        <View>
          <TagArrayField
            control={control}
            name="current_medications"
            label="Danh sách thuốc đang dùng"
            placeholder="Ví dụ: Metformin"
            suggestions={MEDICATION_SUGGESTIONS}
            accentColor="#0F766E"
          />
        </View>
      ) : null}

      {selectedSections.includes("emergency_contacts") ? <EmergencyContactSection /> : null}
    </View>
  );
}

const styles = StyleSheet.create({
  select: {
    marginVertical: 12,
    minHeight: 52,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: "#CBD5E1",
    backgroundColor: "#FFFFFF",
    paddingHorizontal: 14,
  },
  selectedTextStyle: {
    color: "#0F172A",
    fontSize: 15,
    fontWeight: "600",
  },
  placeholderStyle: {
    color: "#64748B",
    fontSize: 14,
  },
  itemTextStyle: {
    color: "#0F172A",
    fontSize: 16,
  },
});
