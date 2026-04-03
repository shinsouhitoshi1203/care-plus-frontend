import { Button } from "@rneui/themed";
import { MenuIcon } from "lucide-react-native";

function MenuBarRoundedButton() {
  return (
    <>
      <Button
        buttonStyle={{ aspectRatio: 1, borderRadius: "50%" }}
        containerStyle={{ margin: 5 }}
        icon={<MenuIcon size={36} />}
        onPress={() => alert("click")}
        type="clear"
        className="rounded-full"
      />
    </>
  );
}
export default MenuBarRoundedButton;
