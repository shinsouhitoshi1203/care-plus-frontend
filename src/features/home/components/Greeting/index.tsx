import useAccount from "@/features/account/useAccount";
import PublicQRComponent from "@/features/emergency/components/PublicQR";
import { Skeleton } from "@rneui/themed";
import { Text, View } from "react-native";
import { getGreetingByTime } from "../../utils/greeting";
import styles from "./styles";

export default function GreetingComponent() {
  const { data: fullName, isPending } = useAccount((user) => user.full_name);
  console.log(fullName);

  return (
    <View style={styles.container}>
      <View className="flex-row items-start justify-between gap-3">
        <View className="flex-1">
          <Text style={styles.greeting}>{getGreetingByTime()}</Text>
          <Text style={styles.name} numberOfLines={1}>
            {isPending ? <Skeleton width={150} height={24} animation="pulse" /> : fullName}
          </Text>
        </View>

        <PublicQRComponent />
      </View>
    </View>
  );
}
