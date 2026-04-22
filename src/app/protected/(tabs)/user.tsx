import ButtonList from "@/components/ButtonList";
import useLogout from "@/features/user/hooks/useLogout";
import useAuth from "@/hooks/useAuth";
import { SafeAreaContent } from "@/layouts/TabNavigator";
import { Avatar } from "@rneui/themed";
import { useRouter } from "expo-router";
import { BellRing, CircleHelp, Info, LogOutIcon, ShieldCheck, SmartphoneNfc } from "lucide-react-native";
import { useMemo } from "react";
import { Alert, Linking, Pressable, ScrollView, StyleSheet, Text, View } from "react-native";

type UserControlItem = {
  title: string;
  id: string;
  subtitle?: string;
  icon?: React.ComponentType<any>;
  onPress?: () => void;
};

function User() {
  const toggleLogoutDialog = useLogout();
  const { user } = useAuth();
  const router = useRouter();

  const isQuickLogin = user?.loginType === "quick_login";

  const UserControlList: UserControlItem[] = useMemo(() => {
    return [
      {
        title: "Hướng dẫn sử dụng",
        id: "guide",
        subtitle: "Mẹo thao tác và cách dùng nhanh Care+",
        icon: CircleHelp,
        onPress: () => router.push("/protected/userDetails/guide"),
      },
      {
        title: "Cài đặt thông báo",
        id: "notification-setting",
        subtitle: "Kiểm tra quyền nhận nhắc thuốc và SOS",
        icon: BellRing,
        onPress: () =>
          Alert.alert("Thông báo", "Mở cài đặt hệ thống để bật thông báo cho Care+", [
            { text: "Để sau", style: "cancel" },
            { text: "Mở cài đặt", onPress: () => Linking.openSettings() },
          ]),
      },
      {
        title: "Liên hệ hỗ trợ",
        id: "support",
        subtitle: "Gửi email cho đội ngũ Care+",
        icon: Info,
        onPress: () => Linking.openURL("mailto:support@careplus.app"),
      },
      {
        title: "Đăng xuất",
        id: "logout",
        icon: LogOutIcon,
        subtitle: "Đăng xuất khỏi thiết bị hiện tại",
        onPress: toggleLogoutDialog,
      },
      {
        title: "Phiên bản",
        id: "version",
        subtitle: "version 0.1.0",
        icon: Info,
      },
    ];
  }, [router, toggleLogoutDialog]);

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      {/* Header Profile Info */}
      <Pressable onPress={() => router.push("/protected/userDetails")} style={styles.headerCard}>
        <Avatar
          size={80}
          rounded
          icon={{ name: "user", type: "font-awesome" }}
          containerStyle={styles.avatarContainer}
          source={user?.avatar_url ? { uri: user.avatar_url } : undefined}
        />
        <View style={styles.profileInfo}>
          <Text style={styles.userName}>{user?.full_name || "Thành viên"}</Text>

          <View style={styles.badgeRow}>
            <View style={[styles.badge, isQuickLogin ? styles.quickLoginBadge : styles.fullAccountBadge]}>
              {isQuickLogin ? <SmartphoneNfc size={12} color="#856404" /> : <ShieldCheck size={12} color="#155724" />}
              <Text style={[styles.badgeText, isQuickLogin ? styles.quickLoginBadgeText : styles.fullAccountBadgeText]}>
                {isQuickLogin ? "Đăng nhập nhanh" : "Tài khoản đầy đủ"}
              </Text>
            </View>
          </View>
          {user?.family && user.family.length > 0 && (
            <Text style={styles.familyText}>
              {user.family[0].family.name} • {user.family[0].family_role === "OWNER" ? "Chủ hộ" : "Thành viên"}
            </Text>
          )}
        </View>
      </Pressable>

      {/* Settings List */}
      <ButtonList data={UserControlList} />
      <SafeAreaContent />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F8FBFF",
  },
  content: {
    padding: 16,
    gap: 16,
  },
  headerCard: {
    backgroundColor: "#FFFFFF",
    borderRadius: 20,
    padding: 24,
    flexDirection: "row",
    alignItems: "center",
    gap: 16,
    borderWidth: 1,
    borderColor: "#E7EEF8",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 10,
    elevation: 2,
  },
  avatarContainer: {
    backgroundColor: "#EDF3FC",
    borderWidth: 3,
    borderColor: "#FFFFFF",
  },
  profileInfo: {
    flex: 1,
    gap: 6,
  },
  userName: {
    fontSize: 22,
    fontWeight: "700",
    color: "#1A2A44",
  },
  badgeRow: {
    flexDirection: "row",
  },
  badge: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    paddingVertical: 4,
    paddingHorizontal: 10,
    borderRadius: 20,
    borderWidth: 1,
  },
  quickLoginBadge: {
    backgroundColor: "#FFF8E1",
    borderColor: "#FFE082",
  },
  quickLoginBadgeText: {
    color: "#856404",
  },
  fullAccountBadge: {
    backgroundColor: "#E8F5E9",
    borderColor: "#C8E6C9",
  },
  fullAccountBadgeText: {
    color: "#155724",
  },
  badgeText: {
    fontSize: 12,
    fontWeight: "600",
  },
  familyText: {
    fontSize: 13,
    color: "#66758D",
    fontWeight: "500",
  },
});

export default User;
