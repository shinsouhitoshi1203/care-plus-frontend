import { Avatar } from "@rneui/themed";

function UserAvatar() {
  return (
    <>
      <Avatar size={48} rounded title="A" containerStyle={{ backgroundColor: "blue", borderRadius: "50%" }} />
    </>
  );
}
export default UserAvatar;
