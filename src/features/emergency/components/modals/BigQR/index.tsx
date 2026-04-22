import QR from "@/components/QR";
import usePublicURL from "@/features/emergency/hooks/usePublicURL";
import useZustandStore from "@/stores/zustand";
import { X } from "lucide-react-native";
import { Modal, Pressable, StyleSheet, Text, View } from "react-native";

export default function BigEmergencyQRModal() {
  const isOpen = useZustandStore((state) => state.behavior.modal.isOpen);
  const content = useZustandStore((state) => state.behavior.modal.content);
  const closeModal = useZustandStore((state) => state.closeModal);

  const { qrURL, id } = usePublicURL();

  if (!isOpen || content !== "emergency-qr") {
    return null;
  }

  return (
    <Modal animationType="fade" transparent={true} visible={isOpen} onRequestClose={closeModal}>
      <View style={styles.overlay}>
        <Pressable style={styles.backdrop} onPress={closeModal} />

        <View style={styles.modalCard}>
          <Pressable onPress={closeModal} style={styles.closeButton}>
            <X color="#475569" size={18} />
          </Pressable>

          <Text style={styles.title}>Mã QR Khẩn Cấp</Text>
          <Text style={styles.subtitle}>Đưa mã này cho người hỗ trợ để mở thông tin nhanh.</Text>

          <View style={styles.qrWrapper}>
            <QR size={220} url={qrURL} />
          </View>

          <Text style={styles.subtitle}>ID: {id}</Text>

          <Text style={styles.footerHint}>Nhấn ra ngoài để đóng</Text>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    alignItems: "center",
    flex: 1,
    justifyContent: "center",
  },
  backdrop: {
    backgroundColor: "rgba(2, 6, 23, 0.56)",
    bottom: 0,
    left: 0,
    position: "absolute",
    right: 0,
    top: 0,
  },
  modalCard: {
    alignItems: "center",
    backgroundColor: "#FFFFFF",
    borderColor: "#E2E8F0",
    borderRadius: 24,
    borderWidth: 1,
    maxWidth: 360,
    minWidth: 300,
    paddingBottom: 18,
    paddingHorizontal: 18,
    paddingTop: 14,
    shadowColor: "#020617",
    shadowOffset: { width: 0, height: 12 },
    shadowOpacity: 0.2,
    shadowRadius: 20,
  },
  closeButton: {
    alignItems: "center",
    alignSelf: "flex-end",
    backgroundColor: "#F1F5F9",
    borderRadius: 999,
    height: 32,
    justifyContent: "center",
    width: 32,
  },
  title: {
    color: "#0F172A",
    fontSize: 22,
    fontWeight: "800",
    marginTop: 8,
  },
  subtitle: {
    color: "#64748B",
    fontSize: 13,
    lineHeight: 18,
    marginTop: 8,
    textAlign: "center",
  },
  qrWrapper: {
    alignItems: "center",
    backgroundColor: "#F8FAFC",
    borderColor: "#E2E8F0",
    borderRadius: 18,
    borderWidth: 1,
    marginTop: 16,
    padding: 16,
  },
  footerHint: {
    color: "#94A3B8",
    fontSize: 12,
    fontStyle: "italic",
    marginTop: 12,
  },
});
