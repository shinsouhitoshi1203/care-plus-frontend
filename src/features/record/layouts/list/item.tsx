import { formatDateTime } from "@/utils/datetime";
import { Button, ListItem } from "@rneui/themed";
import { useRouter } from "expo-router";
import { Activity, Droplets, HeartPulse, PencilIcon, Scale, StickyNote, TrashIcon } from "lucide-react-native";
import { useRef } from "react";
import { Alert, StyleSheet, Text, View } from "react-native";
import { RecordAPI } from "../../api";
import useDeleteItem from "../../hooks/useDeleteItem";
interface HealthRecordItem {
  _id?: string;
  type: string;
  value: Record<string, number>;
  unit: string;
  note?: string;
  recorded_at?: string;
  updated_at?: string;
  created_at?: string;
}
const recordTypeConfig: Record<
  string,
  {
    title: string;
    description: string;
    icon: typeof Activity;
    accent: string;
    bg: string;
    iconColor: string;
  }
> = {
  blood_pressure: {
    title: "Huyết áp",
    description: "Chỉ số tim mạch",
    icon: HeartPulse,
    accent: "bg-rose-500/10",
    bg: "bg-rose-500",
    iconColor: "#e11d48",
  },
  blood_sugar: {
    title: "Đường huyết",
    description: "Chỉ số glucose",
    icon: Droplets,
    accent: "bg-sky-500/10",
    bg: "bg-sky-500",
    iconColor: "#0284c7",
  },
  weight: {
    title: "Cân nặng",
    description: "Chỉ số cơ thể",
    icon: Scale,
    accent: "bg-emerald-500/10",
    bg: "bg-emerald-500",
    iconColor: "#059669",
  },
};

function getRecordValue(item: HealthRecordItem) {
  if (item.type === "blood_pressure") {
    const systolic = item.value.systolic;
    const diastolic = item.value.diastolic;

    if (typeof systolic === "number" && typeof diastolic === "number") {
      return `${systolic}/${diastolic}`;
    }
  }
  const firstValue = Object.values(item.value)[0];
  return typeof firstValue === "number" ? `${firstValue}` : "—";
}

function getRecordConfig(type: string) {
  return (
    recordTypeConfig[type] ?? {
      title: type.replace(/_/g, " "),
      accent: "bg-slate-500/10",
      bg: "bg-slate-500/15",
    }
  );
}

const styles = StyleSheet.create({
  container: {
    borderRadius: 24,
    paddingHorizontal: 16,
    paddingVertical: 14,
    borderWidth: 1,
    borderColor: "#e2e8f0",
    backgroundColor: "#ffffff",
    shadowColor: "#0f172a",
    shadowOpacity: 0.06,
    shadowOffset: { width: 0, height: 10 },
    shadowRadius: 24,
    elevation: 2,
  },
});

interface RecordItemProps {
  item: HealthRecordItem & { _id: string; family_member_id: string };
  disabled?: boolean;
}

const RecordItem = ({ item, disabled }: RecordItemProps) => {
  const config = getRecordConfig(item.type);
  // const Icon = config.icon;
  const id = useRef(item._id);
  const memberID = useRef(item.family_member_id);
  const { _id, ...allowedPayload } = item;

  const handleDeleteDialog = useDeleteItem(id.current, memberID.current);
  const router = useRouter();

  const handleEdit = async () => {
    // console.log(rawData.current);
    // Check only allow to update if the created_at is the same date as now, otherwise block
    if (new Date(item.created_at as any).toDateString() !== new Date().toDateString()) {
      Alert.alert("Lỗi", "Chỉ có thể chỉnh sửa lần đo trong ngày");
      return;
    }

    await RecordAPI.saveEditTargetToLocal({
      ...allowedPayload,
      memberID: memberID.current,
    });
    router.navigate({ pathname: "/protected/records/[recordID]/edit", params: { recordID: id.current } });
  };

  return (
    <ListItem containerStyle={styles.container}>
      <ListItem.Content>
        <View className="flex flex-row items-start justify-between gap-4">
          <View className="flex-1">
            <Text className="mt-1 text-sm text-slate-700">
              {formatDateTime(item.updated_at ?? item.recorded_at ?? item.created_at)}
            </Text>
            <View className="flex flex-row items-center gap-3 pt-4">
              <View className="flex flex-row items-center h-[100%]">
                <Text className="text-base font-bold text-slate-900">{config.title}</Text>
              </View>
              <View className={`items-start flex flex-row gap-2 rounded-2xl ${config.bg} px-3 py-2`}>
                <Text className="text-2xl font-bold leading-5 text-white">{getRecordValue(item)}</Text>
                <Text className="text-[10px] font-semibold uppercase tracking-[0.18em] text-slate-300">
                  {item.unit}
                </Text>
              </View>
            </View>
          </View>
          <View className="ml-2 mt-1 shrink-0 flex flex-row gap-3">
            <Button
              icon={<PencilIcon />}
              type="clear"
              onPress={handleEdit}
              disabled={disabled}
              buttonStyle={{ opacity: disabled ? 0.5 : 1 }}
            />
            <Button
              icon={<TrashIcon />}
              type="clear"
              onPress={handleDeleteDialog}
              disabled={disabled}
              buttonStyle={{ opacity: disabled ? 0.5 : 1 }}
            />
          </View>
        </View>

        {item.note ? (
          <View className="mt-3 flex-row items-start gap-2 rounded-2xl bg-amber-50 px-3 py-3">
            <StickyNote color="#b45309" size={16} strokeWidth={2.2} />
            <View className="flex-1">
              <Text className="text-xs font-semibold uppercase tracking-[0.16em] text-amber-700">Ghi chú</Text>
              <Text className="mt-1 text-sm leading-5 text-amber-900">{item.note}</Text>
            </View>
          </View>
        ) : null}
      </ListItem.Content>
    </ListItem>
  );
};

export default RecordItem;
