import { Button } from "@rneui/themed";
import { useRouter } from "expo-router";
import { useContext } from "react";
import { View } from "react-native";
import ResponsiveContext from "../contexts/Responsive";
import { ResponsiveProps } from "../hooks/useResponsive";

function NewButton() {
  const { showAuthActionsInOneRow } = useContext<ResponsiveProps>(ResponsiveContext);
  const router = useRouter();
  return (
    <>
      <View
        className={showAuthActionsInOneRow ? "flex-1" : "w-full"}
        style={showAuthActionsInOneRow ? { marginLeft: 6 } : undefined}
      >
        <Button
          title="Tạo tài khoản mới"
          type="clear"
          buttonStyle={{ minHeight: showAuthActionsInOneRow ? 56 : 48, backgroundColor: "#E6EAF4" }}
          titleStyle={{
            color: "#2C5EDB",
            fontSize: 24,
            fontWeight: "700",
            lineHeight: 22,
          }}
          radius={10}
          onPress={() => router.push("/(auth)/register")}
        />
      </View>
    </>
  );
}
export default NewButton;
