import { TriangleAlertIcon } from "lucide-react-native";
import { Text, View } from "react-native";

const Error = {
  Block({ text }: { text?: string }) {
    return (
      <View
        style={{
          backgroundColor: "#F8D7DA",
          padding: 10,
          borderRadius: 5,
          marginBottom: 10,

          flexGrow: 1,
          minWidth: 0,
          alignItems: "flex-start",
          flexDirection: "row",
        }}
      >
        <TriangleAlertIcon color="red" size={36} style={{ marginTop: 2 }} />
        <Text style={{ color: "red", flexShrink: 1, marginLeft: 8 }}>{text || "Đã có lỗi xảy ra."}</Text>
      </View>
    );
  },
};

export default Error;
