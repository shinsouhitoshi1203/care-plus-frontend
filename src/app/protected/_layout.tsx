import { stackOptions } from "@/config/routing";
import withWaitFallback from "@/hocs/withWaitFallback";
import useAuth from "@/hooks/useAuth";
import useZustandStore from "@/stores/zustand";
import { Stack } from "expo-router";

import { usePushNotifications } from "@/hooks/usePushNotifications";
import { SOSAlertOverlay } from "@/components/SOS/SOSAlertOverlay";

function ProtectedLayout() {
  const { isAuthenticated, isPending } = useAuth();
  const setLoading = useZustandStore((state) => state.setLoading);
  
  // Khởi tạo hệ thống thông báo đẩy khi đã đăng nhập
  usePushNotifications(isAuthenticated);

  return (
    <>
      <Stack
        screenOptions={stackOptions}
        screenListeners={{
          transitionEnd: () => setLoading(false),
          transitionStart: () => setLoading(true),
        }}
      >
        <Stack.Protected guard={isAuthenticated}>
          <Stack.Screen name="(tabs)" />
          <Stack.Screen name="records" />
          <Stack.Screen name="family/[familyId]" />
        </Stack.Protected>
      </Stack>
      
      {/* Lớp phủ cảnh báo khẩn cấp */}
      <SOSAlertOverlay />
    </>
  );
}
export default withWaitFallback(ProtectedLayout);
