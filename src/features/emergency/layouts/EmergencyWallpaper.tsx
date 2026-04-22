import IconTextButton from "@/components/buttons/IconTextButton";
import * as MediaLibrary from "expo-media-library";
import { Download } from "lucide-react-native";
import { useCallback, useMemo, useRef, useState } from "react";
import { Alert, Dimensions, PixelRatio, Platform, Text, View } from "react-native";
import { captureRef } from "react-native-view-shot";
import { HOTLINES } from "../utils/data";

export default function EmergencyWallpaper() {
  const wallpaperRef = useRef<View>(null);
  const [isSaving, setIsSaving] = useState(false);

  const { screenWidth, screenHeight, pixelWidth, pixelHeight } = useMemo(() => {
    const { width, height } = Dimensions.get("window");
    return {
      screenWidth: width,
      screenHeight: height,
      pixelWidth: PixelRatio.getPixelSizeForLayoutSize(width),
      pixelHeight: PixelRatio.getPixelSizeForLayoutSize(height),
    };
  }, []);

  const saveEmergencyWallpaper = useCallback(async () => {
    if (Platform.OS === "web") {
      Alert.alert("Không hỗ trợ", "Tính năng lưu ảnh chỉ hỗ trợ trên thiết bị di động.");
      return;
    }

    try {
      setIsSaving(true);
      const permission = await MediaLibrary.requestPermissionsAsync();
      if (!permission.granted) {
        Alert.alert("Thiếu quyền", "Vui lòng cấp quyền Thư viện ảnh để lưu màn hình khẩn cấp.");
        return;
      }

      const uri = await captureRef(wallpaperRef, {
        format: "png",
        quality: 1,
        result: "tmpfile",
        width: pixelWidth,
        height: pixelHeight,
      });

      await MediaLibrary.saveToLibraryAsync(uri);
      Alert.alert("Đã lưu", "Ảnh số khẩn cấp đã được lưu vào thư viện ảnh của thiết bị.");
    } catch (error) {
      console.error("Save emergency wallpaper error", error);
      Alert.alert("Lưu thất bại", "Không thể tạo ảnh. Vui lòng thử lại.");
    } finally {
      setIsSaving(false);
    }
  }, [pixelHeight, pixelWidth]);

  return (
    <>
      <View className="mt-3" style={{ height: 56 }}>
        <IconTextButton
          title={isSaving ? "Đang lưu ảnh..." : "Lưu số làm hình nền"}
          icon={Download}
          bg="success"
          css={{ borderRadius: 14, borderWidth: 1, borderColor: "#0F766E" }}
          disabled={isSaving}
          onPress={() => {
            void saveEmergencyWallpaper();
          }}
        />
      </View>

      <View
        pointerEvents="none"
        style={{
          position: "absolute",
          left: -10000,
          top: -10000,
          width: screenWidth,
          height: screenHeight,
        }}
      >
        <View
          collapsable={false}
          ref={wallpaperRef}
          style={{
            width: screenWidth,
            height: screenHeight,
            paddingHorizontal: 24,
            paddingVertical: 28,
            backgroundColor: "#F8FAFC",
            justifyContent: "space-between",
          }}
        >
          <View>
            <Text style={{ color: "#B91C1C", fontWeight: "800", fontSize: 16 }}>CARE PLUS</Text>
            <Text style={{ color: "#0F172A", fontWeight: "900", fontSize: 34, marginTop: 6 }}>
              GỌI KHẨN CẤP VIỆT NAM 🇻🇳
            </Text>
            <Text style={{ color: "#475569", marginTop: 10, fontSize: 16, lineHeight: 22 }}>
              Đặt các số điện thoại khẩn cấp quan trọng làm hình nền để gọi khi cần thiết.
            </Text>
          </View>

          <View style={{ gap: 12 }}>
            {HOTLINES.map((hotline) => {
              const Icon = hotline.icon;
              return (
                <View
                  key={`wallpaper-${hotline.number}`}
                  style={{
                    borderRadius: 18,
                    borderWidth: 1,
                    borderColor: "#CBD5E1",
                    backgroundColor: "#FFFFFF",
                    paddingHorizontal: 18,
                    paddingVertical: 16,
                    flexDirection: "row",
                    alignItems: "center",
                    gap: 12,
                  }}
                >
                  <View
                    style={{
                      width: 52,
                      height: 52,
                      borderRadius: 12,
                      backgroundColor: "#FEE2E2",
                      justifyContent: "center",
                      alignItems: "center",
                    }}
                  >
                    <Icon size={26} color="#DC2626" />
                  </View>
                  <View style={{ flex: 1 }}>
                    <Text style={{ color: "#0F172A", fontWeight: "800", fontSize: 20 }}>{hotline.number}</Text>
                    <Text style={{ color: "#334155", fontWeight: "700", fontSize: 15 }}>{hotline.title}</Text>
                  </View>
                </View>
              );
            })}
          </View>

          <Text style={{ color: "#64748B", textAlign: "center", fontSize: 14, lineHeight: 20 }}>
            Care Plus - thông tin khẩn cấp
          </Text>
        </View>
      </View>
    </>
  );
}
