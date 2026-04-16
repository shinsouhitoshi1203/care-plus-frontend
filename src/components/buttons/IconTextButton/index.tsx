import { Button } from "@rneui/themed";

export default function IconTextButton({ bg = "primary", css = {}, icon, ...props }) {
  const IconComponent = icon ?? null;

  const styles = {
    icon: <IconComponent size={48} color="#fff" />,
    buttonStyle: { ...(props.css ?? {}), height: "100%" },
    color: "primary",
  };
  if (bg) styles.color = bg;
  return (
    <>
      <Button {...styles} {...props} />
    </>
  );
}
