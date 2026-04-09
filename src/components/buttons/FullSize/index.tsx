import { Button } from "@rneui/themed";
import { memo } from "react";
import { StyleSheet } from "react-native";
import { cssRaw } from "./style";
const styles = StyleSheet.create(cssRaw as any);

interface FullSizeButtonProps {
  title: string;
  onPress?: () => void;
  icon?: React.ComponentType<any>;
  [key: string]: any;
  variant?: "solid" | "outline" | "clean";
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
      <Button {...props} {...baseProps} type={variant} />
    </>
  );
}
export default memo(FullSizeButton);
//
