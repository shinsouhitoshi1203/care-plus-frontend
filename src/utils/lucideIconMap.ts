import { Clock4Icon, HomeIcon, UserIcon } from "lucide-react-native";

const lucideIconMap: Record<string, React.ComponentType<{ color: string; size: number }>> = {
  home: HomeIcon,
  index: HomeIcon,
  user: UserIcon,
  reminder: Clock4Icon,
};
export default lucideIconMap;
