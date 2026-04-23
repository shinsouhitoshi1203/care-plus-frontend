import AuthAPI from "@/features/auth/api";
import { useSOSStore } from "@/stores/useSOSStore";
import messaging from "@react-native-firebase/messaging";
import * as Notifications from "expo-notifications";
import { useCallback, useEffect } from "react";
import { Platform } from "react-native";
// @ts-ignore
globalThis.RNFB_SILENCE_MODULAR_DEPRECATION_WARNINGS = true;

// Cấu hình handler cho notifications khi app đang ở foreground
Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldShowBanner: true,
    shouldShowList: true,
    shouldPlaySound: true,
    shouldSetBadge: false,
  }),
});

export const usePushNotifications = (isAuthenticated: boolean) => {
  const setActiveAlert = useSOSStore((state) => state.setActiveAlert);

  const ensureMedicationNotificationChannel = useCallback(async function ensureMedicationNotificationChannel() {
    if (Platform.OS !== "android") return;

    await Notifications.setNotificationChannelAsync("default", {
      name: "Nhắc uống thuốc",
      importance: Notifications.AndroidImportance.HIGH,
      lockscreenVisibility: Notifications.AndroidNotificationVisibility.PUBLIC,
      vibrationPattern: [0, 250, 250, 250],
      sound: "default",
    });
  }, []);

  const showMedicationReminderNotification = useCallback(async (remoteMessage: any) => {
    const title = remoteMessage.notification?.title ?? "💊 Nhắc uống thuốc";
    const body = remoteMessage.notification?.body ?? remoteMessage.data?.reminderMessage ?? "Đến giờ uống thuốc rồi!";

    await Notifications.scheduleNotificationAsync({
      content: {
        title,
        body,
        data: remoteMessage.data ?? {},
        sound: "default",
      },
      trigger: null,
    });
  }, []);

  useEffect(() => {
    if (!isAuthenticated || Platform.OS === "web") return;

    const requestUserPermission = async () => {
      await ensureMedicationNotificationChannel();

      const expoPermission = await Notifications.getPermissionsAsync();
      if (expoPermission.status !== "granted") {
        await Notifications.requestPermissionsAsync();
      }

      const authStatus = await messaging().requestPermission();
      const enabled =
        authStatus === messaging.AuthorizationStatus.AUTHORIZED ||
        authStatus === messaging.AuthorizationStatus.PROVISIONAL;

      if (enabled) {
        console.log("Quyền thông báo:", authStatus);
        getFcmToken();
      }
    };

    const getFcmToken = async () => {
      try {
        const token = await messaging().getToken();
        if (token) {
          console.log("FCM Token:", token);
          await AuthAPI.updateDeviceToken(token);
        }
      } catch (error) {
        console.error("Lỗi khi lấy FCM Token:", error);
      }
    };

    requestUserPermission();

    // Lắng nghe refresh token
    const unsubscribeTokenRefresh = messaging().onTokenRefresh(async (token) => {
      console.log("FCM Token refreshed:", token);
      await AuthAPI.updateDeviceToken(token);
    });

    // Lắng nghe khi app đang ở foreground
    const unsubscribeForegroundMessage = messaging().onMessage(async (remoteMessage) => {
      console.log("Foreground Message received:", remoteMessage);

      if (remoteMessage.data?.type === "MEDICATION_REMINDER") {
        await showMedicationReminderNotification(remoteMessage);
        return;
      }

      if (remoteMessage.data?.type === "EMERGENCY_SOS") {
        const { senderName, latitude, longitude, senderId } = remoteMessage.data;
        await Notifications.scheduleNotificationAsync({
          content: {
            title: "🚨 Cảnh báo khẩn cấp từ " + ((senderName as string) || "người thân"),
            body: "Họ vừa gửi một tín hiệu SOS. Hãy kiểm tra ngay!",
            sound: "default",
          },
          trigger: null,
        });

        setActiveAlert({
          senderId: senderId as string,
          senderName: (senderName as string) || "Người thân",
          latitude: latitude as string,
          longitude: longitude as string,
          timestamp: Date.now(),
        });
      }
    });

    // Lắng nghe khi bấm vào notification để mở app (Background/Quit state)
    const unsubscribeNotificationOpened = messaging().onNotificationOpenedApp((remoteMessage) => {
      console.log("Notification caused app to open from background state:", remoteMessage.notification);
      if (remoteMessage.data?.type === "EMERGENCY_SOS") {
        const { senderName, latitude, longitude, senderId } = remoteMessage.data;
        setActiveAlert({
          senderId: senderId as string,
          senderName: (senderName as string) || "Người thân",
          latitude: latitude as string,
          longitude: longitude as string,
          timestamp: Date.now(),
        });
      }
    });

    // Kiểm tra xem app có được mở từ một notification không (Quit state)
    messaging()
      .getInitialNotification()
      .then((remoteMessage) => {
        if (remoteMessage) {
          console.log("Notification caused app to open from quit state:", remoteMessage.notification);
          if (remoteMessage.data?.type === "EMERGENCY_SOS") {
            const { senderName, latitude, longitude, senderId } = remoteMessage.data;
            setActiveAlert({
              senderId: senderId as string,
              senderName: (senderName as string) || "Người thân",
              latitude: latitude as string,
              longitude: longitude as string,
              timestamp: Date.now(),
            });
          }
        }
      });

    return () => {
      unsubscribeTokenRefresh();
      unsubscribeForegroundMessage();
      unsubscribeNotificationOpened();
    };
  }, [isAuthenticated, ensureMedicationNotificationChannel, showMedicationReminderNotification, setActiveAlert]);
};
