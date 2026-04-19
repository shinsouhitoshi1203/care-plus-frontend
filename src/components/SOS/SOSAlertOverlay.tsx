import React, { useEffect, useRef } from 'react';
import { View, Text, TouchableOpacity, Modal, Animated, Linking, StyleSheet } from 'react-native';
import { BellRing, MapPin, X } from 'lucide-react-native';
import { useSOSStore } from '@/stores/useSOSStore';
import * as Haptics from 'expo-haptics';

export const SOSAlertOverlay = () => {
  const { activeAlert, clearAlert } = useSOSStore();
  const blinkAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (activeAlert) {
      // Hiệu ứng nhấp nháy đỏ rực
      const blink = Animated.loop(
        Animated.sequence([
          Animated.timing(blinkAnim, {
            toValue: 1,
            duration: 500,
            useNativeDriver: false,
          }),
          Animated.timing(blinkAnim, {
            toValue: 0,
            duration: 500,
            useNativeDriver: false,
          }),
        ])
      );
      blink.start();
      
      // Rung liên tục để cảnh báo
      const interval = setInterval(() => {
        Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
      }, 2000);

      return () => {
        blink.stop();
        clearInterval(interval);
      };
    }
  }, [activeAlert, blinkAnim]);

  if (!activeAlert) return null;

  const backgroundColor = blinkAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ['rgba(153, 27, 27, 0.95)', 'rgba(220, 38, 38, 1)'],
  });

  const handleOpenMap = () => {
    if (activeAlert.latitude && activeAlert.longitude) {
      const url = `https://www.google.com/maps/search/?api=1&query=${activeAlert.latitude},${activeAlert.longitude}`;
      Linking.openURL(url);
    }
  };

  return (
    <Modal visible={!!activeAlert} transparent animationType="fade">
      <Animated.View style={[styles.container, { backgroundColor }]}>
        <View className="items-center justify-center p-6">
          <View className="bg-white p-6 rounded-full mb-6">
            <BellRing size={64} color="#dc2626" />
          </View>

          <Text className="text-white font-black text-4xl text-center mb-2">
            🚨 CẢNH BÁO SOS! 🚨
          </Text>
          
          <Text className="text-white text-xl text-center mb-8 font-bold">
            {activeAlert.senderName} đang phát tín hiệu khẩn cấp!
          </Text>

          {activeAlert.latitude && (
            <TouchableOpacity 
              onPress={handleOpenMap}
              className="flex-row items-center bg-white/20 px-6 py-4 rounded-2xl mb-8 border border-white/30"
            >
              <MapPin size={24} color="white" className="mr-3" />
              <Text className="text-white font-bold text-lg italic">Xem vị trí trên bản đồ</Text>
            </TouchableOpacity>
          )}

          <TouchableOpacity 
            onPress={clearAlert}
            className="bg-white px-12 py-5 rounded-full shadow-2xl"
          >
            <Text className="text-red-600 font-extrabold text-xl">ĐÃ NHẬN TIN</Text>
          </TouchableOpacity>

          <TouchableOpacity 
            onPress={clearAlert}
            className="absolute top-12 right-6 p-2"
          >
            <X size={32} color="white" />
          </TouchableOpacity>
        </View>
      </Animated.View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
