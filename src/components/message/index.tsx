import { InfoIcon } from "lucide-react-native";
import { Text, View } from "react-native";

const Message = {
  Block({ text, icon, show }: { text?: string; icon?: typeof InfoIcon; show: boolean }) {
    const Icon = icon ?? InfoIcon;
    return (
      <View
        style={{
          backgroundColor: "#D1ECF1",
          padding: 10,
          borderRadius: 5,
          marginBottom: 10,

          flexGrow: 1,
          minWidth: 0,
          alignItems: "flex-start",
          flexDirection: "row",
          visibility: show ? "visible" : "hidden",
        }}
      >
        <Icon color="blue" size={36} style={{ marginTop: 2 }} />
        <Text style={{ color: "blue", flexShrink: 1, marginLeft: 8 }}>{text || "Thông báo"}</Text>
      </View>
    );
  },
};

export default Message;
