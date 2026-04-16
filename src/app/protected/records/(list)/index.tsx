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
  // Get from params or fallback to my own ID if not provided. This allows both viewing family member's records and my own records in the same page.
  const { id } = useLocalSearchParams<{ id?: string }>();
  const { memberID: myID } = useFamily();
  const memberID = useMemo<string>(() => {
    // console.log("specificID", id, "myID", myID);
    return id || myID;
  }, [id, myID]);

  return (
    <View className="pt-8 flex-1">{memberID ? <RecordListLayout memberID={memberID} /> : <SkeletonLoader />}</View>
  );
}
