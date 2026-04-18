import { Button, ButtonProps } from "@rneui/themed";

interface IconTextButtonProps extends ButtonProps {
  bg?: any;
  css?: any;
  icon?: any;
  iconPosition?: any;
}

export default function IconTextButton({ bg = "primary", css = {}, icon, ...props }: IconTextButtonProps) {
  const IconComponent = icon ?? (() => null);

  const styles: any = {
    icon: <IconComponent size={48} color="#fff" />,
    buttonStyle: { ...css, height: "100%" },
    color: bg,
  };
  
  return (
    <>
      <Button {...styles} {...props} />
    </>
  );
}
