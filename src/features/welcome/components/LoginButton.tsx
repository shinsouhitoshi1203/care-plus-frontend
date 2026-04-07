import { Button } from "@rneui/themed";
import { useRouter } from "expo-router";
import { useContext } from "react";
import { View } from "react-native";
import ResponsiveContext from "../contexts/Responsive";
import { ResponsiveProps } from "../hooks/useResponsive";

function LoginButton() {
  const router = useRouter();
  const { showAuthActionsInOneRow } = useContext<ResponsiveProps>(ResponsiveContext);
  return (
    <>
      <View
        className={showAuthActionsInOneRow ? "flex-1" : "mb-3 w-full"}
        style={showAuthActionsInOneRow ? { marginRight: 6 } : undefined}
      >
        <Button
          title="Đăng nhập"
          buttonStyle={{ minHeight: showAuthActionsInOneRow ? 56 : 48, backgroundColor: "#2C5EDB" }}
          titleStyle={{
            color: "#FFFFFF",
            fontSize: 24,
            fontWeight: "700",
            lineHeight: 22,
          }}
          radius={10}
          onPress={() => router.push("/login")}
        />
      </View>
    </>
  );
}
export default LoginButton;
