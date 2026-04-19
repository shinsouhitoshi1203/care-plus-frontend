import { useEffect } from 'react';
import { Platform, Alert } from 'react-native';
import messaging from '@react-native-firebase/messaging';
import AuthAPI from '@/features/auth/api';
import { useSOSStore } from '@/stores/useSOSStore';

export const usePushNotifications = (isAuthenticated: boolean) => {
  const setActiveAlert = useSOSStore((state) => state.setActiveAlert);

  useEffect(() => {
    if (!isAuthenticated) return;

    const requestUserPermission = async () => {
      const authStatus = await messaging().requestPermission();
      const enabled =
        authStatus === messaging.AuthorizationStatus.AUTHORIZED ||
        authStatus === messaging.AuthorizationStatus.PROVISIONAL;

      if (enabled) {
        console.log('Quyền thông báo:', authStatus);
        getFcmToken();
      }
    };

    const getFcmToken = async () => {
      try {
        const token = await messaging().getToken();
        if (token) {
          console.log('FCM Token:', token);
          await AuthAPI.updateDeviceToken(token);
        }
      } catch (error) {
        console.error('Lỗi khi lấy FCM Token:', error);
      }
    };

    requestUserPermission();

    // Lắng nghe refresh token
    const unsubscribeTokenRefresh = messaging().onTokenRefresh(async (token) => {
      console.log('FCM Token refreshed:', token);
      await AuthAPI.updateDeviceToken(token);
    });

    // Lắng nghe khi app đang ở foreground
    const unsubscribeForegroundMessage = messaging().onMessage(async (remoteMessage) => {
      console.log('Foreground Message received:', remoteMessage);

      if (remoteMessage.data?.type === 'EMERGENCY_SOS') {
        const { senderName, latitude, longitude, senderId } = remoteMessage.data;
        setActiveAlert({
          senderId: senderId as string,
          senderName: (senderName as string) || 'Người thân',
          latitude: latitude as string,
          longitude: longitude as string,
          timestamp: Date.now(),
        });
      }
    });

    // Lắng nghe khi bấm vào notification để mở app (Background/Quit state)
    const unsubscribeNotificationOpened = messaging().onNotificationOpenedApp((remoteMessage) => {
        console.log('Notification caused app to open from background state:', remoteMessage.notification);
        if (remoteMessage.data?.type === 'EMERGENCY_SOS') {
            const { senderName, latitude, longitude, senderId } = remoteMessage.data;
            setActiveAlert({
              senderId: senderId as string,
              senderName: (senderName as string) || 'Người thân',
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
          console.log('Notification caused app to open from quit state:', remoteMessage.notification);
          if (remoteMessage.data?.type === 'EMERGENCY_SOS') {
            const { senderName, latitude, longitude, senderId } = remoteMessage.data;
            setActiveAlert({
              senderId: senderId as string,
              senderName: (senderName as string) || 'Người thân',
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
  }, [isAuthenticated, setActiveAlert]);
};
