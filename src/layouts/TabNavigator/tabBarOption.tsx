import lucideIconMap from "@/utils/lucideIconMap";
import { tabBarBaseOptions } from "./tabBarBaseOption";
type tabBarOptionProps = Readonly<{
  key: string;
  name: string;
  path?: string;
}> &
  Readonly<{
    params?: Readonly<object | undefined>;
  }>;
type tabBarIconProps = {
  focused: boolean;
  color: string;
  size: number;
};

function tabBarOption({ route }: { route: tabBarOptionProps }) {
  return {
    tabBarIcon: ({ focused, color, size }: tabBarIconProps) => {
      // You can return any component that you like here!
      const IconComponent = lucideIconMap[route.name];
      if (IconComponent) {
        return <IconComponent color={color} size={size} />;
      }
      return null;
    },
    ...tabBarBaseOptions,
  };
}
export default tabBarOption;
