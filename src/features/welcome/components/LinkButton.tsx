import { Button } from "@rneui/themed";
import { QrCodeIcon } from "lucide-react-native";
import { useContext, useState } from "react";
import { Alert, Modal, View } from "react-native";
import ResponsiveContext from "../contexts/Responsive";
import type { ResponsiveProps } from "../hooks/useResponsive";
import { useMutation } from "@tanstack/react-query";
import QuickLoginAPI from "@/features/quickLogin/api";
import TokenService from "@/features/auth/token";
import Scanner from "@/components/QR/Scanner";
import LoadingDialog from "@/components/Loading/LoadingDialog";
import { useRouter } from "expo-router";

function LinkButton() {
  const { showMemberLinkIcon } = useContext<ResponsiveProps>(ResponsiveContext);
  const router = useRouter();
  const [scannerVisible, setScannerVisible] = useState(false);

  const quickLoginMutation = useMutation({
    mutationFn: async ({ token, fingerprint }: { token: string; fingerprint: string }) => {
      return await QuickLoginAPI.loginByDevice(token, fingerprint);
    },
    onSuccess: async (data) => {
      const { tokens } = data;
      await TokenService.setTokens(tokens);
      // Chuyển hướng đến trang chủ
      router.replace("/protected/(tabs)/home");
    },
    onError: (error) => {
      console.log("Quick login error:", error);
      Alert.alert("Lỗi", "Không thể đăng nhập bằng thiết bị này. Vui lòng thử lại hoặc liên hệ chủ nhà.");
    },
  });

  const handleScan = async (data: string) => {
    try {
      const parsed = JSON.parse(data);
      if (parsed.type === QuickLoginAPI.QR_TYPE && parsed.device_token && parsed.setup_secret) {
        setScannerVisible(false);
        // Lưu data và login
        await TokenService.setQuickLoginData({
          deviceToken: parsed.device_token,
          fingerprint: parsed.setup_secret,
        });
        await quickLoginMutation.mutateAsync({
          token: parsed.device_token,
          fingerprint: parsed.setup_secret,
        });
      } else {
        Alert.alert("Mã QR không hợp lệ", "Vui lòng quét mã QR liên kết được tạo từ ứng dụng Care+ của người thân.");
      }
    } catch (e) {
      Alert.alert("Lỗi", "Mã QR không đúng định dạng.");
    }
  };

  return (
    <>
      <View className="mb-3 w-full">
        <Button
          title="Liên kết máy"
          type="outline"
          icon={showMemberLinkIcon ? <QrCodeIcon size={34} color="#2C5EDB" strokeWidth={2.2} /> : undefined}
          iconContainerStyle={showMemberLinkIcon ? { marginRight: 14 } : undefined}
          buttonStyle={{
            minHeight: 92,
            backgroundColor: "#EEF3FF",
            borderColor: "#C2D0EF",
            borderWidth: 2,
            borderRadius: 22,
            justifyContent: "center",
            paddingHorizontal: 18,
            gap: 10,
          }}
          titleStyle={{
            color: "#2C5EDB",
            fontSize: 22,
            fontWeight: "700",
            lineHeight: 30,
            textAlign: showMemberLinkIcon ? "left" : "center",
          }}
          onPress={() => setScannerVisible(true)}
        />
      </View>

      <Modal visible={scannerVisible} animationType="slide" onRequestClose={() => setScannerVisible(false)}>
        <Scanner onScan={handleScan} onClose={() => setScannerVisible(false)} title="Liên kết thiết bị Guest" />
      </Modal>

      <LoadingDialog show={quickLoginMutation.isPending} />
    </>
  );
}

export default LinkButton;
