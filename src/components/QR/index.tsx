import { Alert, Pressable } from "react-native";
import QRCode from "react-native-qrcode-svg";
// TODO: Add QR code for user profile or appointment details
interface QRProps {
  url?: string;
  size?: number;
}

function QR({ url, size }: QRProps) {
  return (
    <Pressable
      onPress={() => {
        if (!url) Alert.alert("No URL", "No URL provided for QR code.");
        Alert.alert("QR Code Pressed", `${url}`);
      }}
    >
      <QRCode value={url} size={size || 64} color="black" backgroundColor="white" />
    </Pressable>
  );
}
export default QR;
