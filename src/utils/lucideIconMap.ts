import { Clock4Icon, HomeIcon, LayoutGrid, UserIcon } from "lucide-react-native";

const lucideIconMap: Record<string, React.ComponentType<{ color: string; size: number }>> = {
  home: LayoutGrid,
  index: HomeIcon,
  family: HomeIcon,
  user: UserIcon,
  reminder: Clock4Icon,
};
export default lucideIconMap;
