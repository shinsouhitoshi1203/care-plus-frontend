import FullSizeButton from "@/components/buttons/FullSize";
import AuthAPI from "@/features/auth/api";
import TokenService from "@/features/auth/token";
import useZustandStore from "@/stores/zustand";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useRouter } from "expo-router";

import { useCallback } from "react";
function LogoutButton() {
  const router = useRouter();
  const queryClient = useQueryClient();
  const setIsLoading = useZustandStore((state) => state.setLoading);
  const { mutate } = useMutation({
    mutationKey: ["user"],
    mutationFn: async () => {
      await AuthAPI.logout();
      await TokenService.clearTokens();
    },
    onSettled: () => {
      setIsLoading(false);
      queryClient.removeQueries({ queryKey: ["user"] });
      // Navigate to login page or perform any other necessary actions after logout
      console.log("User logged out successfully");
      router.replace("/(auth)/welcome");
    },
    onMutate: () => {
      setIsLoading(true);
    },
  });

  const openDialog = useZustandStore((state) => state.openDialog);
  const toggleLogoutDialog = useCallback(() => {
    openDialog({
      title: "Lưu ý",
      message: "Bạn có chắc chắn muốn đăng xuất không?",
      confirmText: "Đăng xuất",
      handler: async () => {
        mutate();
      },
    });
  }, [openDialog, mutate]);

  return (
    <>
      <FullSizeButton title="Đăng xuất" onPress={toggleLogoutDialog} />
    </>
  );
}
export default LogoutButton;
