import QRCode from "react-native-qrcode-svg";
// TODO: Add QR code for user profile or appointment details
interface QRProps {
  value?: string;
  size?: number;
}

function QR({ value, size }: QRProps) {
  return (
    <>
      <QRCode value={value || "https://expo.dev"} size={size || 64} color="black" backgroundColor="white" />
    </>
  );
}
export default QR;
