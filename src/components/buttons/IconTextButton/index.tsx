import { Button } from "@rneui/themed";

export default function IconTextButton({ bg = "primary", icon, ...props }) {
  const IconComponent = icon ?? null;

  const styles = {
    icon: <IconComponent size={48} color="#fff" />,
    buttonStyle: { height: "100%", ...(props.buttonStyle ?? {}) },
    color: "primary",
  };
  if (bg) styles.color = bg;
  return (
    <>
      <Button {...styles} {...props} />
    </>
  );
}
