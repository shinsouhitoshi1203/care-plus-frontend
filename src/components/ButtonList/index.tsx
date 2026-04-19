import { ListItem } from "@rneui/themed";
import { View } from "react-native";
import { styles } from "./styles";
export type ButtonListItem = {
  id: string;
  title: string;
  subtitle?: string;
  icon?: React.ComponentType<any>;
  onPress?: () => void;
};

export type ButtonListProps = {
  data: ButtonListItem[];
};

export default function ButtonList({ data }: ButtonListProps) {
  return (
    <>
      <View style={styles.listCard}>
        {data.map(({ id, title, icon: Icon, onPress, subtitle }) => (
          <ListItem key={id} containerStyle={styles.listItem} onPress={onPress} disabled={!onPress}>
            <View className="h-12 w-12 rounded-xl bg-slate-100 items-center justify-center">
              {Icon ? <Icon size={24} color="#334155" /> : null}
            </View>

            <ListItem.Content>
              <ListItem.Title style={styles.listTitle}>{title}</ListItem.Title>
              {subtitle && <ListItem.Subtitle style={styles.listSubtitle}>{subtitle}</ListItem.Subtitle>}
            </ListItem.Content>
          </ListItem>
        ))}
      </View>
    </>
  );
}
