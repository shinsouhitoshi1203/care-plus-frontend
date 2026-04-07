import { Button } from "@rneui/themed";
import { useContext } from "react";
import { Alert, View } from "react-native";
import ResponsiveContext from "../contexts/Responsive";
import { ResponsiveProps } from "../hooks/useResponsive";

function NewButton() {
  const { showAuthActionsInOneRow } = useContext<ResponsiveProps>(ResponsiveContext);

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
          onPress={() => Alert.alert("Thông báo", "Tính năng tạo tài khoản sẽ sớm ra mắt")}
        />
      </View>
    </>
  );
}
export default NewButton;
