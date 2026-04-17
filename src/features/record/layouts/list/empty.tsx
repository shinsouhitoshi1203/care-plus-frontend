import { AlertTriangle } from "lucide-react-native";
import { Text, View } from "react-native";

export default function EmptyList() {
  return (
    <>
      <View className="items-center rounded-[28px] border border-dashed border-slate-300 bg-white px-6 py-10">
        <View className="h-14 w-14 items-center justify-center rounded-2xl bg-slate-100">
          <AlertTriangle color="#64748b" size={28} />
        </View>
        <Text className="mt-4 text-lg font-semibold text-slate-900">Chưa có dữ liệu</Text>
      </View>
    </>
  );
}
