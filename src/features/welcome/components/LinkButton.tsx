import { Button } from "@rneui/themed";
import { QrCodeIcon } from "lucide-react-native";
import { useContext } from "react";
import { Alert, View } from "react-native";
import ResponsiveContext from "../contexts/Responsive";
import type { ResponsiveProps } from "../hooks/useResponsive";

function LinkButton() {
  const { showMemberLinkIcon } = useContext<ResponsiveProps>(ResponsiveContext);
  return (
    <View className="mb-3 w-full">
      <Button
        title="Liên kết máy của gia đình"
        type="outline"
        icon={showMemberLinkIcon ? <QrCodeIcon size={34} color="#2C5EDB" strokeWidth={2.2} /> : undefined}
        iconContainerStyle={showMemberLinkIcon ? { marginRight: 14 } : undefined}
        buttonStyle={{
          minHeight: 92,
          backgroundColor: "#EEF3FF",
          borderColor: "#C2D0EF",
          borderWidth: 2,
          borderRadius: 22,
          justifyContent: showMemberLinkIcon ? "flex-start" : "center",
          paddingHorizontal: 18,
        }}
        titleStyle={{
          color: "#2C5EDB",
          fontSize: 22,
          fontWeight: "700",
          lineHeight: 30,
          textAlign: showMemberLinkIcon ? "left" : "center",
        }}
        onPress={() => Alert.alert("Thông báo", "Tính năng liên kết thiết bị đang được phát triển")}
      />
    </View>
  );
}
export default LinkButton;
