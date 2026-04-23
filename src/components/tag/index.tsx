import { Chip } from "@rneui/themed";

export default function Tag({ title, size = "sm" }: { title: string; size?: "sm" | "md" | "lg" }) {
  return <Chip title={title} size={size} />;
}
