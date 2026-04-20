import useAccount from "@/features/account/useAccount";
import { Avatar } from "@rneui/themed";
import { useRouter } from "expo-router";

function UserAvatar() {
  const { data: avatar } = useAccount((state) => state?.avatar_url);
  const router = useRouter();
  return (
    <>
      <Avatar
        icon={{ name: "user", type: "font-awesome", color: "#919191" }}
        size={48}
        rounded
        source={avatar ? { uri: avatar } : undefined}
        containerStyle={{ backgroundColor: "#e6e6e6", borderRadius: "50%" }}
        onPress={() => router.push("/protected/userDetails")}
      />
    </>
  );
}
export default UserAvatar;
