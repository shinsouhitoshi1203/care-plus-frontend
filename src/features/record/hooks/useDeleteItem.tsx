import useZustandStore from "@/stores/zustand";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useRouter } from "expo-router";
import { useCallback } from "react";
import { Alert } from "react-native";
import { RecordAPI } from "../api";
import { hardcodedID } from "../schema";

export default function useDeleteItem(id: string) {
  const router = useRouter();
  const queryClient = useQueryClient();
  const openDialog = useZustandStore((state) => state.openDialog);
  const setLoading = useZustandStore((state) => state.setLoading);
  const { mutate } = useMutation({
    mutationKey: ["health-record"],
    mutationFn: async () => {
      await RecordAPI.deleteHealthRecord({
        ...hardcodedID,
        recordID: id,
      });
    },
    onMutate: () => {
      setLoading(true);
      // router.replace("/protected/records/list");
    },
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ["health-records"] });
      Alert.alert("Xóa thành công");
      // router.replace("/protected/records/list");
    },
    onError: (error) => {
      Alert.alert("Xóa thất bại");
    },
    onSettled: () => {
      setLoading(false);
      // router.replace("/protected/records/list");
    },
  });
  const handleDeleteDialog = useCallback(() => {
    openDialog({
      title: "Xác nhận xóa",
      message: "Bạn có chắc chắn muốn xóa lần đo này không?",
      confirmText: "Xóa",
      handler: () => {
        mutate();
      },
    });
  }, [openDialog, mutate]);

  return handleDeleteDialog;
}
