import IconTextButton from "@/components/buttons/IconTextButton";
import { Card } from "@rneui/themed";
import { Alert, Text, View } from "react-native";
import { HOTLINES } from "../utils/data";
import EmergencyWallpaper from "./EmergencyWallpaper";

export default function EmergencyNumbers() {
  return (
    <>
      <Card containerStyle={{ margin: 0, borderRadius: 20, borderColor: "#E2E8F0" }}>
        <View className="flex-row items-center justify-between">
          <Text className="text-slate-900 text-lg font-bold">Số điện thoại cần nhớ 🇻🇳 </Text>
        </View>
        <Text className="text-slate-600 mt-1">
          Để hỗ trợ nhanh chóng trong các tình huống khẩn cấp, bạn nhớ lưu lại các số điện thoại sau:
        </Text>
        <View className="mt-4 flex-row gap-2" style={{ height: 150 }}>
          {HOTLINES.map((hotline) => (
            <View className="flex-1" key={hotline.number}>
              <IconTextButton
                title={hotline.title}
                icon={hotline.icon}
                bg={hotline.bg}
                iconPosition="top"
                css={{ borderRadius: 14, borderWidth: 1, borderColor: "#DC2626" }}
                onPress={() => {
                  Alert.alert(hotline.title, hotline.description);
                }}
              />
            </View>
          ))}
        </View>
      </Card>
      <EmergencyWallpaper />
    </>
  );
}
