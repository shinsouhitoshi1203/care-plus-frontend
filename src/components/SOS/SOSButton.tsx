import React, { useEffect, useRef } from 'react';
import { TouchableOpacity, Text, View, Alert, Animated, StyleSheet } from 'react-native';
import * as Location from 'expo-location';
import * as Haptics from 'expo-haptics';
import { AlertCircle } from 'lucide-react-native';
import FamilyAPI from '@/features/family/api';

export const SOSButton = () => {
  const scaleAnim = useRef(new Animated.Value(1)).current;
  const opacityAnim = useRef(new Animated.Value(0.6)).current;

  useEffect(() => {
    // Hiệu ứng nhấp nháy (pulsing)
    const pulse = Animated.loop(
      Animated.parallel([
        Animated.sequence([
          Animated.timing(scaleAnim, {
            toValue: 1.2,
            duration: 1500,
            useNativeDriver: true,
          }),
          Animated.timing(scaleAnim, {
            toValue: 1,
            duration: 1500,
            useNativeDriver: true,
          }),
        ]),
        Animated.sequence([
          Animated.timing(opacityAnim, {
            toValue: 0.2,
            duration: 1500,
            useNativeDriver: true,
          }),
          Animated.timing(opacityAnim, {
            toValue: 0.6,
            duration: 1500,
            useNativeDriver: true,
          }),
        ]),
      ])
    );
    pulse.start();
    return () => pulse.stop();
  }, [scaleAnim, opacityAnim]);

  const handlePress = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy);
    
    Alert.alert(
      "XÁC NHẬN CẤP CỨU (SOS)", 
      "Gửi tín hiệu cầu cứu khẩn cấp đến toàn bộ người thân trong gia đình?",
      [
        { text: "Hủy", style: "cancel" },
        { 
          text: "GỬI NGAY", 
          style: "destructive",
          onPress: triggerSOS 
        }
      ]
    );
  };

  const triggerSOS = async () => {
    try {
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      
      // Lấy vị trí
      let { status } = await Location.requestForegroundPermissionsAsync();
      let coords = undefined;
      
      if (status === 'granted') {
        const location = await Location.getCurrentPositionAsync({
          accuracy: Location.Accuracy.High,
        });
        coords = {
          latitude: location.coords.latitude,
          longitude: location.coords.longitude,
        };
      } else {
        console.warn('Quyền vị trí bị từ chối, gửi SOS không có tọa độ.');
      }

      await FamilyAPI.sendSOS(coords || {});
      Alert.alert("Đã gửi!", "Tín hiệu SOS đã được phát tán thông qua hệ thống.");
      
    } catch (error) {
      console.error('Lỗi khi kích hoạt SOS:', error);
      Alert.alert("Lỗi", "Không thể gửi tín hiệu SOS lúc này. Vui lòng thử lại!");
    }
  };

  return (
    <View className="items-center justify-center my-8">
      {/* Lớp nền hiệu ứng nhấp nháy */}
      <Animated.View 
        style={[
          styles.pulseCircle,
          {
            transform: [{ scale: scaleAnim }],
            opacity: opacityAnim,
          }
        ]}
      />
      
      <TouchableOpacity
        activeOpacity={0.8}
        onPress={handlePress}
        className="w-32 h-32 bg-red-600 rounded-full items-center justify-center shadow-xl border-4 border-red-400"
        style={{ elevation: 10 }}
      >
        <AlertCircle size={48} color="white" />
        <Text className="text-white font-bold text-xl mt-1">SOS</Text>
      </TouchableOpacity>
      
      <Text className="text-gray-500 mt-4 text-center px-4 italic text-sm">
        Bấm để phát tín hiệu khẩn cấp tới gia đình
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  pulseCircle: {
    position: 'absolute',
    width: 140,
    height: 140,
    borderRadius: 70,
    backgroundColor: '#dc2626',
  }
});
