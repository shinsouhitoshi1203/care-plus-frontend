import LoadingRaw from "@/components/Loading/LoadingRaw";
import AuthAPI from "@/features/auth/api";
import TokenService from "@/features/auth/token";

import QuickLoginAPI from "@/features/quickLogin/api";
import { NotSupported } from "@/layouts/PlatformCheck";

import { useQuery } from "@tanstack/react-query";
import { Redirect } from "expo-router";
import { Platform } from "react-native";
function EntryPage() {
  const { data, isPending } = useQuery({
    queryKey: ["auth.check"],
    queryFn: async () => {
      // === 1. Thử Quick Login (Device-Bound) trước ===
      const deviceToken = await TokenService.getDeviceToken();
      const fingerprint = await TokenService.getDeviceFingerprint();

      if (deviceToken && fingerprint) {
        try {
          const result = await QuickLoginAPI.loginByDevice(deviceToken, fingerprint);
          await TokenService.setTokens(result.tokens);
          await TokenService.setLoginType("quick_login");
          return {
            type: "quick_login" as const,
            member: result.member,
            isAuthenticated: true,
          };
        } catch (error) {
          // Device bị revoke hoặc lỗi → xóa device data, fallback sang login thường
          console.log("Quick login failed, falling back to normal auth:", error);
          await TokenService.clearDeviceData();
        }
      }

      // === 2. Fallback: kiểm tra JWT tokens (luồng hiện tại) ===
      const { accessToken } = await TokenService.getTokens();
      if (!accessToken) {
        return { type: "none" as const, isAuthenticated: false };
      }

      try {
        const user = await AuthAPI.check();
        const isAuthenticated = !!user?.id && user?.is_active;
        if (isAuthenticated) {
          await TokenService.setLoginType("full");
        }
        return {
          type: "full" as const,
          user,
          isAuthenticated,
        };
      } catch {
        return { type: "none" as const, isAuthenticated: false };
      }
    },
    retry: false,
  });

  if (!["ios", "android"].includes(Platform.OS)) {
    // Chặn hoàn toàn các nền tảng không phải mobile (web, desktop)
    return <NotSupported />;
  }

  if (!isPending && !data?.isAuthenticated) {
    return <Redirect href="/(auth)/welcome" />;
  }

  if (data?.isAuthenticated && !isPending) {
    return <Redirect href="/protected/(tabs)/home" />;
  }

  return <LoadingRaw show />;
}
export default EntryPage;
