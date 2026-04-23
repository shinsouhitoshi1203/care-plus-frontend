import { ChevronDown, ChevronUp } from "lucide-react-native";
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
