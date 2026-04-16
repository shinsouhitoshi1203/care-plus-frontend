import { Button } from "@rneui/themed";
import { memo } from "react";
import { styles } from "./style";

interface FullSizeButtonProps {
  title: string;
  onPress?: () => void;
  icon?: React.ComponentType<any>;
  [key: string]: any;
  variant?: "solid" | "outline" | "clear";
}
function FullSizeButton({ variant = "solid", icon, iconDirection, ...props }: FullSizeButtonProps) {
  const IconComponent = icon ?? undefined;

  const baseProps = {
    buttonStyle: styles.fullButton,
    titleStyle: styles.fullButtonTitle,
    iconContainerStyle: styles.fullButtonIcon,
    ...(iconDirection === "right" ? { iconRight: true } : {}),
    ...(IconComponent ? { icon: <IconComponent color="#fff" size={32} /> } : {}),
  } as any;

  return (
    <>
      <Button {...baseProps} containerStyle={{ width: "100%" }} type={variant} {...props} />
    </>
  );
}
export default memo(FullSizeButton);
//
