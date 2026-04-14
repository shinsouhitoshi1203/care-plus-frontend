import { RecordAPI } from "@/features/record/api";
import EmptyList from "@/features/record/layouts/list/empty";
import RecordItem from "@/features/record/layouts/list/item";
import { hardcodedID } from "@/features/record/schema";
import useSubPageTitle from "@/hooks/useSubPageTitle";
import { Skeleton } from "@rneui/themed";
import { useQuery } from "@tanstack/react-query";
import { AlertTriangle } from "lucide-react-native";
import { FlatList, Pressable, Text, View } from "react-native";

export default function RecordListPage() {
  useSubPageTitle("Xem các lần đo đã lưu");
  const {
    data: records,
    isError,
    error,
    isFetching,
    isPending,
    refetch,
  } = useQuery({
    queryKey: ["health-records"],
    queryFn: async () => {
      return await RecordAPI.getHealthRecords({
        ...hardcodedID,
      });
    },
    staleTime: 0,
  });

  return isPending ? (
    <View className="flex-1 items-center justify-center bg-slate-50 px-6">
      <Skeleton animation="pulse" height={400} />
    </View>
  ) : (
    <View className="flex-1">
      <FlatList
        data={records}
        keyExtractor={(item, index) => item._id ?? item.updated_at ?? item.recorded_at ?? `${item.type}-${index}`}
        contentContainerStyle={{ paddingHorizontal: 16, paddingTop: 16, paddingBottom: 28 }}
        ItemSeparatorComponent={() => <View style={{ height: 12 }} />}
        refreshing={isFetching}
        onRefresh={() => {
          void refetch();
        }}
        ListEmptyComponent={EmptyList}
        renderItem={({ item }) => <RecordItem item={item} />}
      />

      {isError ? (
        <View
          style={{
            position: "absolute",
            left: 16,
            right: 16,
            bottom: 16,
          }}
        >
          <View className="rounded-[24px] border border-rose-200 bg-rose-50 px-4 py-4">
            <View className="flex-row items-start gap-3">
              <View className="mt-0.5 h-10 w-10 items-center justify-center rounded-2xl bg-rose-100">
                <AlertTriangle color="#e11d48" size={20} />
              </View>
              <View className="flex-1">
                <Text className="text-base font-semibold text-rose-900">Không thể tải dữ liệu</Text>
                <Text className="mt-1 text-sm leading-5 text-rose-800">
                  {error instanceof Error ? error.message : "Đã xảy ra lỗi khi lấy danh sách lần đo."}
                </Text>
              </View>
              <Pressable
                accessibilityRole="button"
                className="rounded-2xl bg-rose-600 px-3 py-2"
                onPress={() => {
                  void refetch();
                }}
              >
                <Text className="text-sm font-semibold text-white">Thử lại</Text>
              </Pressable>
            </View>
          </View>
        </View>
      ) : null}
    </View>
  );
}
