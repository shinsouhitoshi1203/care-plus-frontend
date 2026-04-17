import useZustandStore from "@/stores/zustand";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { AxiosError } from "axios";
import { useCallback } from "react";
import { Alert } from "react-native";
import { RecordAPI } from "../api";

export default function useDeleteItem(id: string, ownerID: string) {
  const queryClient = useQueryClient();
  const openDialog = useZustandStore((state) => state.openDialog);
  const setLoading = useZustandStore((state) => state.setLoading);
  const { mutate } = useMutation({
    mutationKey: ["health-record"],
    mutationFn: async () => {
      await RecordAPI.deleteHealthRecord({
        memberID: ownerID,
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
      if (error instanceof AxiosError && error.response) {
        Alert.alert("Xóa thất bại", error.response.data.message || "Đã có lỗi xảy ra");
      } else {
        Alert.alert("Xóa thất bại", "Đã có lỗi xảy ra");
      }
    },
    onSettled: () => {
      setLoading(false);
      // router.replace("/protected/records/list");
    },
  });
  const handleDeleteDialog = useCallback(() => {
    try {
      openDialog({
        title: "Xác nhận xóa",
        message: "Bạn có chắc chắn muốn xóa lần đo này không?",
        confirmText: "Xóa",
        handler: () => {
          mutate();
        },
      });
    } catch (error) {
      console.log("Delete record error:", error instanceof Error ? error.message : error);
    }
  }, [openDialog, mutate]);

  return handleDeleteDialog;
}
