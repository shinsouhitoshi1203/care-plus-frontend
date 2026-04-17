import { Clock4Icon, HomeIcon, HousePlusIcon, UserIcon } from "lucide-react-native";

const lucideIconMap: Record<string, React.ComponentType<{ color: string; size: number }>> = {
  home: HomeIcon,
  index: HomeIcon,
  family: HousePlusIcon,
  user: UserIcon,
  reminder: Clock4Icon,
};
export default lucideIconMap;
