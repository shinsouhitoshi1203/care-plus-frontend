import ListItemButton from "@/components/buttons/ListItemButton";
import useLogout from "@/features/user/hooks/useLogout";
import { ListItem } from "@rneui/themed";
import { LogOutIcon } from "lucide-react-native";
import { useMemo } from "react";

function User() {
  const toggleLogoutDialog = useLogout();
  const UserControlList = useMemo(() => {
    return [
      {
        title: "Đăng xuất",
        id: "logout",
        icon: LogOutIcon,
        onPress: toggleLogoutDialog,
      },
      {
        title: "Phiên bản",
        id: "version",
        subtitle: "version 0.1.0",
      },
    ];
  }, [toggleLogoutDialog]);

  return (
    <>
      {UserControlList.map(({ id, title, icon, onPress, subtitle }) => (
        <ListItem key={id}>
          {onPress ? (
            <ListItemButton title={title} onPress={onPress} icon={icon} />
          ) : (
            <ListItem.Content>
              {/* <ListItem.Title>{title}</ListItem.Title> */}
              {subtitle && <ListItem.Subtitle>{subtitle}</ListItem.Subtitle>}
              {/* {content && <ListItem.Subtitle>{content}</ListItem.Subtitle>} */}
            </ListItem.Content>
          )}
        </ListItem>
      ))}
    </>
  );
}
export default User;
