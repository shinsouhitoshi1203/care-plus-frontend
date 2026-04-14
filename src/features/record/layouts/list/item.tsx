import { Button, ListItem } from "@rneui/themed";
import { useRouter } from "expo-router";
import {
  Activity,
  Droplets,
  HeartPulse,
  PencilIcon,
  Scale,
  StickyNote,
  Thermometer,
  TrashIcon,
} from "lucide-react-native";
import { useRef } from "react";
import { StyleSheet, Text, View } from "react-native";
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
    iconBackground: string;
    iconColor: string;
  }
> = {
  blood_pressure: {
    title: "Huyết áp",
    description: "Chỉ số tim mạch",
    icon: HeartPulse,
    accent: "bg-rose-500/10",
    iconBackground: "bg-rose-500/15",
    iconColor: "#e11d48",
  },
  blood_sugar: {
    title: "Đường huyết",
    description: "Chỉ số glucose",
    icon: Droplets,
    accent: "bg-sky-500/10",
    iconBackground: "bg-sky-500/15",
    iconColor: "#0284c7",
  },
  weight: {
    title: "Cân nặng",
    description: "Chỉ số cơ thể",
    icon: Scale,
    accent: "bg-emerald-500/10",
    iconBackground: "bg-emerald-500/15",
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
function formatDate(value?: string) {
  if (!value) return "Chưa có thời gian";

  return new Date(value).toLocaleString("vi-VN", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}
function getRecordConfig(type: string) {
  return (
    recordTypeConfig[type] ?? {
      title: type.replace(/_/g, " "),
      description: "Bản ghi sức khỏe",
      icon: Thermometer,
      accent: "bg-slate-500/10",
      iconBackground: "bg-slate-500/15",
      iconColor: "#475569",
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
const RecordItem = ({ item }) => {
  const config = getRecordConfig(item.type);
  // const Icon = config.icon;
  const id = useRef(item._id);
  const handleDeleteDialog = useDeleteItem(id.current);
  const router = useRouter();

  const handleEdit = () => {
    router.navigate("/protected/records/edit", {});
  };

  return (
    <ListItem containerStyle={styles.container}>
      <ListItem.Content>
        <View className="flex flex-row items-start justify-between gap-4">
          <View className="flex-1">
            <Text className="mt-1 text-sm text-slate-700">
              {formatDate(item.updated_at ?? item.recorded_at ?? item.created_at)}
            </Text>
            <View className="mb-3 flex flex-row">
              <Text className="text-base font-bold text-slate-900">{config.title}</Text>
            </View>
            <View className="items-start flex flex-row gap-2 rounded-2xl bg-slate-900 px-3 py-2 self-start">
              <Text className="text-2xl font-bold leading-5 text-white">{getRecordValue(item)}</Text>
              <Text className="mt-1 text-[10px] font-semibold uppercase tracking-[0.18em] text-slate-300">
                {item.unit}
              </Text>
            </View>
          </View>
          <View className="ml-2 mt-1 shrink-0 flex flex-row gap-3">
            <Button icon={<PencilIcon />} type="clear" onPress={handleEdit} />
            <Button icon={<TrashIcon />} type="clear" onPress={handleDeleteDialog} />
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
