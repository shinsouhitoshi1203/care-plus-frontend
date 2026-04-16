import { ActivityIndicator, Modal } from "react-native";
interface LoadingProps {
  variant?: "light" | "dark";
  show?: boolean;
}

function LoadingRaw({ variant = "light", show = false }: LoadingProps) {
  if (!show) return null;
  return (
    <Modal
      className="flex-1 justify-center items-center  absolute inset-0 w-screen h-screen"
      style={{ backgroundColor: variant === "light" ? "#ffffffd0" : "#000000d0", zIndex: 1000 }}
    >
      <ActivityIndicator
        size={200}
        color={variant === "dark" ? "#fff" : "#ff1000"}
        className="flex-1 justify-center items-center"
      />
    </Modal>
  );
}
export default LoadingRaw;
