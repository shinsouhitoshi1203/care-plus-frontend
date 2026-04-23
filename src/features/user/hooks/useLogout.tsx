import AuthAPI from "@/features/auth/api";
import TokenService from "@/features/auth/token";
import useReset from "@/hooks/useReset";
import useZustandStore from "@/stores/zustand";
import { useMutation } from "@tanstack/react-query";
import { useRouter } from "expo-router";

import { useCallback } from "react";
function useLogout() {
  const router = useRouter();
  const resetAll = useReset();
  const setIsLoading = useZustandStore((state) => state.setLoading);
  const { mutate } = useMutation({
    mutationKey: ["user"],
    mutationFn: async () => {
      // Lấy fingerprint trước để gửi lên BE (revoke quick login device token)
      const fingerprint = await TokenService.getDeviceFingerprint();
      try {
        await AuthAPI.logout(fingerprint);
      } catch (e) {
        console.error("Logout API error:", e);
      } finally {
        await TokenService.clearAll();
      }
    },
    onSettled: () => {
      setIsLoading(false);

      void resetAll({ clearPersistence: true });
      // Navigate to login page or perform any other necessary actions after logout
      console.log("User logged out successfully");
      if (router.canDismiss()) router.dismissAll();
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

  return toggleLogoutDialog;
}
export default useLogout;
