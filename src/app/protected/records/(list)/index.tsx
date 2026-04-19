import useFamily from "@/features/record/hooks/useFamily";
import RecordListLayout from "@/features/record/layouts/list";
import { Skeleton } from "@rneui/base";
import { useLocalSearchParams } from "expo-router";
import { useMemo } from "react";
import { View } from "react-native";

function SkeletonLoader() {
  return [1, 2, 3, 4, 5].map((i) => (
    <Skeleton key={`list-skeleton-record-${i}`} animation="pulse" height={80} style={{ marginBottom: 20 }} />
  ));
}

export default function RecordListPage() {
  // Hiện tại đang chọn memberID dựa trên query param (nếu có) - chính là field id của FamilyMember
  // hoặc userID của chính mình, chưa tính tới id của quickDevice. Em làm thì thêm default là id FamilyMember
  const { id } = useLocalSearchParams<{ id?: string }>();
  const { memberID: myID } = useFamily();
  const memberID = useMemo<string>(() => {
    // console.log("specificID", id, "myID", myID);
    return id || myID;
  }, [id, myID]);

  return <View className="flex-1">{memberID ? <RecordListLayout memberID={memberID} /> : <SkeletonLoader />}</View>;
}
