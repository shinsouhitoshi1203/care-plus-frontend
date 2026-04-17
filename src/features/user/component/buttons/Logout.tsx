import FullSizeButton from "@/components/buttons/FullSize";

import useLogout from "../../hooks/useLogout";
function LogoutButton() {
  const toggleLogoutDialog = useLogout();

  return (
    <>
      <FullSizeButton title="Đăng xuất" onPress={toggleLogoutDialog} />
    </>
  );
}
export default LogoutButton;
