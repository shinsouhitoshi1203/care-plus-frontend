import React, { useState, useEffect } from "react";
import { StyleSheet, Text, View, Pressable, Dimensions } from "react-native";
import { CameraView, useCameraPermissions } from "expo-camera";
import { X, Zap, ZapOff } from "lucide-react-native";

interface ScannerProps {
  onScan: (data: string) => void;
  onClose: () => void;
  title?: string;
}

const { width } = Dimensions.get("window");
const scannerSize = width * 0.7;

export default function Scanner({ onScan, onClose, title = "Quét mã QR" }: ScannerProps) {
  const [permission, requestPermission] = useCameraPermissions();
  const [scanned, setScanned] = useState(false);
  const [torch, setTorch] = useState(false);

  useEffect(() => {
    if (!permission) {
      requestPermission();
    }
  }, [permission]);

  if (!permission) {
    return <View style={styles.container} />;
  }

  if (!permission.granted) {
    return (
      <View style={styles.centerContainer}>
        <Text style={styles.text}>Cần quyền truy cập máy ảnh để quét mã QR</Text>
        <Pressable onPress={requestPermission} style={styles.button}>
          <Text style={styles.buttonText}>Cấp quyền</Text>
        </Pressable>
        <Pressable onPress={onClose} style={styles.closeButton}>
          <X color="#FFFFFF" size={24} />
        </Pressable>
      </View>
    );
  }

  const handleBarCodeScanned = ({ data }: { data: string }) => {
    if (scanned) return;
    setScanned(true);
    onScan(data);
  };

  return (
    <View style={styles.container}>
      <CameraView
        style={StyleSheet.absoluteFillObject}
        facing="back"
        enableTorch={torch}
        onBarcodeScanned={scanned ? undefined : handleBarCodeScanned}
        barcodeScannerSettings={{
          barcodeTypes: ["qr"],
        }}
      >
        <View style={styles.overlay}>
          <View style={styles.header}>
            <Text style={styles.title}>{title}</Text>
            <Pressable onPress={onClose} style={styles.iconButton}>
              <X color="#FFFFFF" size={28} />
            </Pressable>
          </View>

          <View style={styles.scannerContainer}>
            <View style={styles.scannerFrame}>
              <View style={[styles.corner, styles.topLeft]} />
              <View style={[styles.corner, styles.topRight]} />
              <View style={[styles.corner, styles.bottomLeft]} />
              <View style={[styles.corner, styles.bottomRight]} />
            </View>
          </View>

          <View style={styles.footer}>
            <Pressable onPress={() => setTorch(!torch)} style={styles.torchButton}>
              {torch ? <ZapOff color="#FFFFFF" size={24} /> : <Zap color="#FFFFFF" size={24} />}
              <Text style={styles.torchText}>{torch ? "Tắt đèn" : "Bật đèn"}</Text>
            </Pressable>
            <Text style={styles.hint}>Di chuyển camera đến mã QR để quét</Text>
          </View>
        </View>
      </CameraView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#000",
  },
  centerContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#000",
    padding: 20,
  },
  text: {
    color: "#FFF",
    textAlign: "center",
    fontSize: 16,
    marginBottom: 20,
  },
  button: {
    backgroundColor: "#2C5EDB",
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 12,
  },
  buttonText: {
    color: "#FFF",
    fontWeight: "700",
    fontSize: 16,
  },
  closeButton: {
    position: "absolute",
    top: 50,
    right: 20,
    padding: 10,
  },
  overlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.5)",
    justifyContent: "space-between",
    paddingVertical: 60,
  },
  header: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 20,
  },
  title: {
    color: "#FFF",
    fontSize: 20,
    fontWeight: "700",
    textAlign: "center",
  },
  iconButton: {
    position: "absolute",
    right: 20,
    padding: 10,
  },
  scannerContainer: {
    alignItems: "center",
    justifyContent: "center",
  },
  scannerFrame: {
    width: scannerSize,
    height: scannerSize,
    backgroundColor: "transparent",
    position: "relative",
  },
  corner: {
    position: "absolute",
    width: 40,
    height: 40,
    borderColor: "#2C5EDB",
  },
  topLeft: {
    top: 0,
    left: 0,
    borderTopWidth: 5,
    borderLeftWidth: 5,
    borderTopLeftRadius: 20,
  },
  topRight: {
    top: 0,
    right: 0,
    borderTopWidth: 5,
    borderRightWidth: 5,
    borderTopRightRadius: 20,
  },
  bottomLeft: {
    bottom: 0,
    left: 0,
    borderBottomWidth: 5,
    borderLeftWidth: 5,
    borderBottomLeftRadius: 20,
  },
  bottomRight: {
    bottom: 0,
    right: 0,
    borderBottomWidth: 5,
    borderRightWidth: 5,
    borderBottomRightRadius: 20,
  },
  footer: {
    alignItems: "center",
    gap: 20,
  },
  torchButton: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "rgba(255,255,255,0.2)",
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 25,
    gap: 8,
  },
  torchText: {
    color: "#FFF",
    fontSize: 14,
    fontWeight: "600",
  },
  hint: {
    color: "#CCC",
    fontSize: 14,
  },
});
