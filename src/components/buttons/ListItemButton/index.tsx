import { Button } from "@rneui/themed";
import { memo } from "react";
import { styles } from "./style";

interface ListItemButtonProps {
  title: string;
  onPress?: () => void;
  icon?: React.ComponentType<any>;
  [key: string]: any;
  variant?: "light" | "dark";
}
function ListItemButton({ variant = "light", icon, iconDirection, ...props }: ListItemButtonProps) {
  const IconComponent = icon ?? undefined;

  const baseProps = {
    buttonStyle: styles.fullButton,
    titleStyle: {
      fontSize: 22,
      fontWeight: "700" as const,
      color: variant === "light" ? "#000" : "#fff",
    },
    iconContainerStyle: styles.fullButtonIcon,
    ...(iconDirection === "right" ? { iconRight: true } : {}),
    ...(IconComponent ? { icon: <IconComponent color={variant === "light" ? "#000" : "#fff"} size={32} /> } : {}),
  } as any;

  return (
    <>
      <Button {...baseProps} type="clear" containerStyle={{ width: "100%" }} {...props} />
    </>
  );
}
export default memo(ListItemButton);
//
