import { BadgeQuestionMark } from "lucide-react-native/icons";
import { Pressable } from "react-native";
import QRCode from "react-native-qrcode-svg";
// TODO: Add QR code for user profile or appointment details
interface QRProps {
  url?: string;
  size?: number;
  handlePress?: (url: string) => void;
}

function QR({ url, size, handlePress = (x: string) => {} }: QRProps) {
  // const handlePress = () => {
  if (!url) {
    return (
      <Pressable
        onPress={() => handlePress(url || "")}
        style={{ width: size || 64, height: size || 64 }}
        className="flex items-center justify-center"
      >
        <BadgeQuestionMark size={size || 32} />
      </Pressable>
    );
  }
  return (
    <Pressable onPress={() => handlePress?.(url)}>
      <QRCode value={url} size={size || 64} color="black" backgroundColor="white" />
    </Pressable>
  );
}
export default QR;
