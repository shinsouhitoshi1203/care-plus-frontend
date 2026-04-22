import QR from "@/components/QR";
import { Text, View } from "react-native";
import styles from "./Quick.styles";

export default function QuickComponent() {
  return (
    <View style={styles.container}>
      <View className="flex-row items-start justify-between gap-3">
        <View className="flex-1">
          <Text style={styles.greeting}>Xin chào,</Text>
          <Text style={styles.name} numberOfLines={1}>
            Nguyễn Minh Khang
          </Text>
        </View>

        <View style={styles.qrContainer}>
          <QR url="https://google.com" />
        </View>
      </View>
    </View>
  );
}
