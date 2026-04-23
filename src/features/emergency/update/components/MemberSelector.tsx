import { ChevronDown, ChevronUp, UserRound } from "lucide-react-native";
import { StyleSheet, Text, View } from "react-native";
import { Dropdown } from "react-native-element-dropdown";
import { type DropdownOption, type EmergencyMemberProfile } from "../types";

interface MemberSelectorProps {
  options: DropdownOption<string>[];
  value: string;
  onChange: (nextMemberId: string) => void;
  activeMember?: EmergencyMemberProfile;
}

export default function MemberSelector({ options, value, onChange, activeMember }: MemberSelectorProps) {
  return (
    <View className="rounded-3xl border border-slate-200 bg-white p-4">
      <Text className="text-base font-bold text-slate-900">Thành viên cần cập nhật</Text>
      <Text className="mt-1 text-xs text-slate-500">
        Dữ liệu form sẽ tự đổi theo từng người để bạn kiểm tra và chỉnh sửa nhanh.
      </Text>

      <Dropdown
        data={options}
        value={value}
        labelField="label"
        valueField="value"
        placeholder="Chọn thành viên"
        style={styles.dropdown}
        selectedTextStyle={styles.selectedTextStyle}
        placeholderStyle={styles.placeholderStyle}
        itemTextStyle={styles.itemTextStyle}
        onChange={(item) => onChange(item.value as string)}
        renderRightIcon={(visible) =>
          visible ? <ChevronUp size={18} color="#334155" /> : <ChevronDown size={18} color="#334155" />
        }
      />

      {activeMember ? (
        <View className="mt-3 flex-row items-center gap-3 rounded-2xl border border-slate-200 bg-slate-50 px-3 py-3">
          <View
            style={{
              width: 12,
              height: 12,
              borderRadius: 999,
              backgroundColor: activeMember.highlight,
            }}
          />
          <View className="flex-1">
            <Text className="font-semibold text-slate-800">{activeMember.full_name}</Text>
            <View className="mt-1 flex-row items-center gap-2">
              <UserRound size={14} color="#64748B" />
              <Text className="text-xs text-slate-500">
                {activeMember.relation} • {activeMember.age} tuổi
              </Text>
            </View>
          </View>
        </View>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  dropdown: {
    marginTop: 12,
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
    fontSize: 15,
  },
});
