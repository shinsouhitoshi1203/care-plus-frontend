import QR from "@/components/QR";
import useZustandStore from "@/stores/zustand";
import { Pressable, StyleSheet } from "react-native";
import usePublicURL from "../../hooks/usePublicURL";
const styles = StyleSheet.create({
  qrContainer: {
    backgroundColor: "#fff",
    borderRadius: 16,
    padding: 8,
  },
});
export default function PublicQRComponent() {
  const { qr } = usePublicURL();

  // console.log("Public QR URL:", qr);
  const openModal = useZustandStore((state) => state.openModal);
  const handlePress = (url: string) => {
    openModal("emergency-qr");
  };
  return (
    <>
      <Pressable style={styles.qrContainer} onPress={() => handlePress(qr?.qrURL || "")} hitSlop={18}>
        <QR url={qr?.qrURL} handlePress={handlePress} />
      </Pressable>
    </>
  );
}
