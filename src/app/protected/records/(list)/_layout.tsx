import HealthRecordFilter from "@/features/record/layouts/list/filter";
import useSubPageTitle from "@/hooks/useSubPageTitle";
import { Button } from "@rneui/themed";
import { Stack, useRouter } from "expo-router";
import { FilterIcon, Plus } from "lucide-react-native";
import { useState } from "react";
import { View } from "react-native";

export default function RecordListLayout() {
  useSubPageTitle("Xem các lần đo đã lưu");
  const router = useRouter();
  const [viewForm, setViewForm] = useState(false);
  return (
    <>
      <View className="gap-4 mb-8">
        <View className="flex-row justify-between ">
          <Button color="lime" icon={<Plus size={36} />} onPress={() => router.navigate("/protected/records/add")} />
          <Button type="clear" icon={<FilterIcon size={36} />} onPress={() => setViewForm((_) => !_)} />
        </View>

        {viewForm && <HealthRecordFilter />}
      </View>

      <Stack
        screenOptions={{
          headerShown: false,
        }}
      />
    </>
  );
}
