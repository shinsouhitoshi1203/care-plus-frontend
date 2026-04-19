import FamilyAPI from "@/features/family/api";
import useAnimationButton from "@/features/sos/hooks/useAnimationButton";
import getCoordination from "@/features/sos/services/getCoordination";
import useZustandStore from "@/stores/zustand";
import { useMutation } from "@tanstack/react-query";
import * as Haptics from "expo-haptics";
import { AlertCircle } from "lucide-react-native";
import React from "react";
import { Alert, Animated, StyleSheet, Text, TouchableOpacity, View } from "react-native";

export const SOSButton = () => {
  const { scaleAnim, opacityAnim } = useAnimationButton();
  const setLoading = useZustandStore((state) => state.setLoading);
  const handlePress = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy);

    Alert.alert("XÁC NHẬN CẤP CỨU (SOS)", "Gửi tín hiệu cầu cứu khẩn cấp đến toàn bộ người thân trong gia đình?", [
      { text: "Hủy", style: "cancel" },
      {
        text: "GỬI NGAY",
        style: "destructive",
        onPress: triggerSOS,
      },
    ]);
  };

  const { mutate } = useMutation({
    mutationFn: async () => {
      const coords = await getCoordination();
      await FamilyAPI.sendSOS(coords || {});
    },
    mutationKey: ["triggerSOS"],
    onMutate: () => {
      setLoading(true);
    },
    onError: (error) => {
      console.error("Lỗi khi kích hoạt SOS:", error);
      Alert.alert("Lỗi", "Không thể gửi tín hiệu SOS lúc này. Vui lòng thử lại!");
    },
    onSettled: () => {
      setLoading(false);
    },
  });

  const triggerSOS = () => mutate();

  return (
    <View className="items-center justify-center my-8">
      {/* Lớp nền hiệu ứng nhấp nháy */}
      <Animated.View
        style={[
          styles.pulseCircle,
          {
            transform: [{ scale: scaleAnim }],
            opacity: opacityAnim,
          },
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

      <Text className="text-gray-500 mt-8 text-center px-4 italic text-sm">
        Bấm để phát tín hiệu khẩn cấp tới gia đình
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  pulseCircle: {
    position: "absolute",
    width: 140,
    height: 140,
    borderRadius: 70,
    top: -10,
    backgroundColor: "#dc2626",
  },
});
