import LoadingDialog from "@/components/Loading/LoadingDialog";
import FamilyAPI from "@/features/family/api";
import QuickLoginAPI from "@/features/quickLogin/api";
import TokenService from "@/features/auth/token";
import { DeviceItem } from "@/features/quickLogin/types";
import { FamilyMemberItem } from "@/features/family/types";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { AxiosError } from "axios";
import { Smartphone, SmartphoneNfc, Shield, Trash2, UserPlus, ChevronLeft } from "lucide-react-native";
import { useState } from "react";
import {
  Alert,
  Modal,
  Pressable,
  RefreshControl,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";

export default function DeviceManagementPage() {
  const { familyId } = useLocalSearchParams<{ familyId: string }>();
  const queryClient = useQueryClient();
  const router = useRouter();
  const [setupModalVisible, setSetupModalVisible] = useState(false);
  const [selectedMember, setSelectedMember] = useState<FamilyMemberItem | null>(null);
  const [setupResult, setSetupResult] = useState<{ device_token: string; member: any } | null>(null);

  // Lấy danh sách thiết bị đã gán
  const {
    data: devices = [],
    isPending: devicesLoading,
    refetch: refetchDevices,
    isRefetching: devicesRefetching,
  } = useQuery({
    queryKey: ["family-devices", familyId],
    queryFn: () => FamilyAPI.getDevices(familyId!),
    enabled: !!familyId,
  });

  // Lấy danh sách members (để chọn ai cần setup)
  const { data: members = [], isPending: membersLoading } = useQuery({
    queryKey: ["family-members", familyId],
    queryFn: () => FamilyAPI.getMembers(familyId!),
    enabled: !!familyId,
  });

  // Mutation: Setup device cho member
  const setupMutation = useMutation({
    mutationFn: async (memberId: string) => {
      const fingerprint = await QuickLoginAPI.getOrCreateFingerprint();
      const deviceName = QuickLoginAPI.getDeviceName();
      return await FamilyAPI.setupDevice(familyId!, memberId, {
        device_fingerprint: fingerprint,
        device_name: deviceName,
      });
    },
    onSuccess: async (data) => {
      setSetupResult(data);
      // Lưu device_token vào SecureStore để thiết bị này tự động đăng nhập
      await TokenService.setDeviceToken(data.device_token);
      await queryClient.invalidateQueries({ queryKey: ["family-devices", familyId] });
    },
    onError: (error) => {
      const axiosError = error as AxiosError<{ message?: string }>;
      Alert.alert(
        "Thiết lập thất bại",
        axiosError.response?.data?.message ?? "Có lỗi xảy ra"
      );
    },
  });

  // Mutation: Revoke device
  const revokeMutation = useMutation({
    mutationFn: (memberId: string) => FamilyAPI.revokeDevice(familyId!, memberId),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ["family-devices", familyId] });
      Alert.alert("Thành công", "Đã thu hồi quyền đăng nhập trên thiết bị");
    },
    onError: (error) => {
      const axiosError = error as AxiosError<{ message?: string }>;
      Alert.alert("Thu hồi thất bại", axiosError.response?.data?.message ?? "Có lỗi xảy ra");
    },
  });

  const handleSetup = (member: FamilyMemberItem) => {
    setSelectedMember(member);
    setSetupResult(null);
    setSetupModalVisible(true);
  };

  const confirmSetup = () => {
    if (!selectedMember) return;
    const memberId = selectedMember.member_id || selectedMember.id;
    if (!memberId) return;
    setupMutation.mutate(memberId);
  };

  const handleRevoke = (device: DeviceItem) => {
    Alert.alert(
      "Thu hồi thiết bị",
      `Bạn có chắc muốn thu hồi quyền đăng nhập của "${device.display_name ?? "Thành viên"}"?\n\nThiết bị sẽ không còn tự động đăng nhập được.`,
      [
        { text: "Hủy", style: "cancel" },
        {
          text: "Thu hồi",
          style: "destructive",
          onPress: () => revokeMutation.mutate(device.member_id),
        },
      ]
    );
  };

  const closeSetupModal = () => {
    setSetupModalVisible(false);
    setSelectedMember(null);
    setSetupResult(null);
  };

  // Members chưa có quick-login
  const membersWithoutDevice = members.filter((m) => {
    const memberId = m.member_id || m.id;
    return !devices.some((d) => d.member_id === memberId);
  });

  const formatDate = (dateStr: string | null) => {
    if (!dateStr) return "Chưa đăng nhập";
    return new Date(dateStr).toLocaleDateString("vi-VN", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  return (
    <>
      <LoadingDialog
        show={devicesLoading || membersLoading || setupMutation.isPending || revokeMutation.isPending}
      />

      <ScrollView
        style={styles.container}
        contentContainerStyle={styles.content}
        refreshControl={
          <RefreshControl refreshing={devicesRefetching} onRefresh={refetchDevices} />
        }
      >
        {/* Header */}
        <View style={styles.headerBlock}>
          <Pressable onPress={() => router.back()} style={styles.backButton}>
            <ChevronLeft size={20} color="#2C5EDB" />
            <Text style={styles.backText}>Quay lại</Text>
          </Pressable>
          <Text style={styles.heading}>Quản lý thiết bị</Text>
          <Text style={styles.subHeading}>
            Thiết lập đăng nhập nhanh cho người thân không cần tài khoản
          </Text>
        </View>

        {/* Hướng dẫn */}
        <View style={styles.infoCard}>
          <SmartphoneNfc size={20} color="#2C5EDB" />
          <View style={{ flex: 1 }}>
            <Text style={styles.infoTitle}>Đăng nhập nhanh là gì?</Text>
            <Text style={styles.infoText}>
              Thiết lập trên thiết bị của người thân (ông/bà, trẻ nhỏ) để họ mở app là
              vào thẳng, không cần email hay mật khẩu. Bạn có thể thu hồi bất cứ lúc nào.
            </Text>
          </View>
        </View>

        {/* Danh sách thiết bị đã gán */}
        <View style={styles.card}>
          <View style={styles.cardHeader}>
            <Smartphone size={18} color="#2C5EDB" />
            <Text style={styles.cardTitle}>Thiết bị đã thiết lập ({devices.length})</Text>
          </View>

          {devices.length === 0 ? (
            <Text style={styles.emptyText}>Chưa có thiết bị nào được thiết lập đăng nhập nhanh.</Text>
          ) : (
            <View style={styles.deviceList}>
              {devices.map((device) => (
                <View key={device.member_id} style={styles.deviceItem}>
                  <View style={styles.deviceInfo}>
                    <Text style={styles.deviceName}>
                      {device.display_name ?? "Thành viên"}
                    </Text>
                    <Text style={styles.deviceMeta}>
                      {device.device_name ?? "Thiết bị không rõ"}
                    </Text>
                    {device.family_relation && (
                      <Text style={styles.deviceRelation}>{device.family_relation}</Text>
                    )}
                    <Text style={styles.deviceLastLogin}>
                      Đăng nhập gần nhất: {formatDate(device.quick_login_at)}
                    </Text>
                  </View>
                  <Pressable
                    onPress={() => handleRevoke(device)}
                    style={styles.revokeButton}
                    hitSlop={8}
                  >
                    <Trash2 size={18} color="#DC3545" />
                  </Pressable>
                </View>
              ))}
            </View>
          )}
        </View>

        {/* Thêm thiết bị mới */}
        <View style={styles.card}>
          <View style={styles.cardHeader}>
            <UserPlus size={18} color="#2C5EDB" />
            <Text style={styles.cardTitle}>Thêm thiết bị mới</Text>
          </View>

          {membersWithoutDevice.length === 0 ? (
            <Text style={styles.emptyText}>
              Tất cả thành viên đã được thiết lập đăng nhập nhanh.
            </Text>
          ) : (
            <View style={styles.memberList}>
              {membersWithoutDevice.map((member, index) => (
                <Pressable
                  key={member.member_id || member.id || `member-${index}`}
                  style={styles.memberSetupItem}
                  onPress={() => handleSetup(member)}
                >
                  <View style={{ flex: 1 }}>
                    <Text style={styles.memberSetupName}>
                      {member.full_name ?? "Thành viên"}
                    </Text>
                    <Text style={styles.memberSetupMeta}>
                      {member.email ?? member.phone ?? "Chưa có thông tin"}
                    </Text>
                  </View>
                  <View style={styles.setupBadge}>
                    <Smartphone size={14} color="#2C5EDB" />
                    <Text style={styles.setupBadgeText}>Thiết lập</Text>
                  </View>
                </Pressable>
              ))}
            </View>
          )}
        </View>
      </ScrollView>

      {/* Modal xác nhận thiết lập */}
      <Modal
        visible={setupModalVisible}
        transparent
        animationType="fade"
        onRequestClose={closeSetupModal}
      >
        <View style={styles.modalOverlay}>
          <Pressable style={styles.modalBackdrop} onPress={closeSetupModal} />
          <View style={styles.modalCard}>
            <View style={styles.modalHeaderRow}>
              <Text style={styles.modalTitle}>
                {setupResult ? "Thiết lập thành công!" : "Xác nhận thiết lập"}
              </Text>
              <Pressable onPress={closeSetupModal} hitSlop={8}>
                <Text style={styles.modalCloseText}>Đóng</Text>
              </Pressable>
            </View>

            {!setupResult ? (
              <View style={styles.modalBody}>
                <Shield size={32} color="#2C5EDB" style={{ alignSelf: "center" }} />
                <Text style={styles.modalBodyText}>
                  Thiết lập đăng nhập nhanh cho{" "}
                  <Text style={{ fontWeight: "700" }}>
                    {selectedMember?.full_name ?? "thành viên"}
                  </Text>{" "}
                  trên thiết bị này?
                </Text>
                <Text style={styles.modalBodyHint}>
                  Sau khi thiết lập, thiết bị này sẽ tự động đăng nhập vào tài khoản của thành
                  viên khi mở app. Bạn có thể thu hồi bất cứ lúc nào.
                </Text>

                <View style={styles.warningBox}>
                  <Shield size={16} color="#856404" />
                  <Text style={styles.warningText}>
                    Bạn phải thực hiện thao tác này trên điện thoại của người thân.
                  </Text>
                </View>

                <View style={styles.modalButtons}>
                  <Pressable onPress={closeSetupModal} style={styles.cancelButton}>
                    <Text style={styles.cancelButtonText}>Hủy</Text>
                  </Pressable>
                  <Pressable onPress={confirmSetup} style={styles.confirmButton}>
                    <Text style={styles.confirmButtonText}>Thiết lập</Text>
                  </Pressable>
                </View>
              </View>
            ) : (
              <View style={styles.modalBody}>
                <View style={styles.successIcon}>
                  <SmartphoneNfc size={32} color="#28A745" />
                </View>
                <Text style={styles.modalBodyText}>
                  Đã thiết lập cho{" "}
                  <Text style={{ fontWeight: "700" }}>
                    {setupResult.member.display_name}
                  </Text>
                </Text>
                <Text style={styles.modalBodyHint}>
                  Thiết bị này giờ có thể tự động đăng nhập. Khi mở app lần tới, thành viên sẽ
                  vào thẳng trang chủ mà không cần nhập mật khẩu.
                </Text>
                <Pressable onPress={closeSetupModal} style={styles.confirmButton}>
                  <Text style={styles.confirmButtonText}>Hoàn tất</Text>
                </Pressable>
              </View>
            )}
          </View>
        </View>
      </Modal>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F8FBFF",
  },
  content: {
    paddingHorizontal: 16,
    paddingTop: 8,
    paddingBottom: 32,
    gap: 14,
  },
  headerBlock: {
    marginBottom: 2,
  },
  backButton: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    marginBottom: 8,
  },
  backText: {
    color: "#2C5EDB",
    fontSize: 14,
    fontWeight: "600",
  },
  heading: {
    fontSize: 28,
    fontWeight: "700",
    color: "#1A2A44",
  },
  subHeading: {
    marginTop: 4,
    color: "#66758D",
    fontSize: 14,
    fontWeight: "500",
  },
  infoCard: {
    flexDirection: "row",
    backgroundColor: "#EDF4FF",
    borderRadius: 14,
    padding: 14,
    gap: 12,
    borderWidth: 1,
    borderColor: "#CFE0F9",
    alignItems: "flex-start",
  },
  infoTitle: {
    fontSize: 14,
    fontWeight: "700",
    color: "#1D3556",
    marginBottom: 4,
  },
  infoText: {
    fontSize: 13,
    color: "#4B5C74",
    lineHeight: 20,
  },
  card: {
    backgroundColor: "#FFFFFF",
    borderRadius: 16,
    padding: 14,
    gap: 12,
    borderWidth: 1,
    borderColor: "#E7EEF8",
  },
  cardHeader: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: "#1F2F46",
  },
  emptyText: {
    color: "#6F7E96",
    fontSize: 14,
  },
  deviceList: {
    gap: 10,
  },
  deviceItem: {
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#E2EAF6",
    backgroundColor: "#FCFEFF",
    borderRadius: 12,
    padding: 12,
  },
  deviceInfo: {
    flex: 1,
    gap: 2,
  },
  deviceName: {
    color: "#1B2A40",
    fontWeight: "700",
    fontSize: 15,
  },
  deviceMeta: {
    color: "#607188",
    fontSize: 13,
  },
  deviceRelation: {
    color: "#2C5EDB",
    fontSize: 12,
    fontWeight: "600",
  },
  deviceLastLogin: {
    color: "#8A96A8",
    fontSize: 12,
    marginTop: 2,
  },
  revokeButton: {
    padding: 8,
    borderRadius: 8,
    backgroundColor: "#FFF0F1",
    borderWidth: 1,
    borderColor: "#FDDDE0",
  },
  memberList: {
    gap: 8,
  },
  memberSetupItem: {
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#DAE5F7",
    borderRadius: 12,
    padding: 12,
    backgroundColor: "#FAFCFF",
  },
  memberSetupName: {
    color: "#1B2A40",
    fontWeight: "700",
    fontSize: 15,
  },
  memberSetupMeta: {
    color: "#607188",
    fontSize: 13,
    marginTop: 2,
  },
  setupBadge: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    backgroundColor: "#EDF4FF",
    borderRadius: 8,
    paddingVertical: 6,
    paddingHorizontal: 10,
    borderWidth: 1,
    borderColor: "#CFE0F9",
  },
  setupBadgeText: {
    color: "#2C5EDB",
    fontSize: 12,
    fontWeight: "700",
  },
  modalOverlay: {
    flex: 1,
    justifyContent: "center",
    paddingHorizontal: 18,
    backgroundColor: "rgba(14, 26, 46, 0.38)",
  },
  modalBackdrop: {
    ...StyleSheet.absoluteFillObject,
  },
  modalCard: {
    backgroundColor: "#FFFFFF",
    borderRadius: 18,
    padding: 16,
    borderWidth: 1,
    borderColor: "#DCE7F8",
    gap: 12,
  },
  modalHeaderRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  modalTitle: {
    fontSize: 16,
    fontWeight: "700",
    color: "#1F2F46",
  },
  modalCloseText: {
    color: "#2C5EDB",
    fontSize: 14,
    fontWeight: "700",
  },
  modalBody: {
    gap: 14,
  },
  modalBodyText: {
    fontSize: 15,
    color: "#1F2F46",
    textAlign: "center",
    lineHeight: 22,
  },
  modalBodyHint: {
    fontSize: 13,
    color: "#66758D",
    textAlign: "center",
    lineHeight: 20,
  },
  successIcon: {
    alignSelf: "center",
    backgroundColor: "#E8F5E9",
    borderRadius: 50,
    padding: 16,
  },
  modalButtons: {
    flexDirection: "row",
    gap: 10,
  },
  cancelButton: {
    flex: 1,
    borderRadius: 12,
    paddingVertical: 11,
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#AAB8CC",
    backgroundColor: "#F4F7FB",
  },
  cancelButtonText: {
    color: "#42536B",
    fontWeight: "700",
    fontSize: 15,
  },
  confirmButton: {
    flex: 1,
    backgroundColor: "#2C5EDB",
    borderRadius: 12,
    paddingVertical: 11,
    alignItems: "center",
  },
  confirmButtonText: {
    color: "#FFFFFF",
    fontWeight: "700",
    fontSize: 15,
  },
  warningBox: {
    flexDirection: "row",
    backgroundColor: "#FFF8E1",
    padding: 10,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#FFE082",
    alignItems: "center",
    gap: 8,
    marginTop: 4,
  },
  warningText: {
    flex: 1,
    fontSize: 12,
    color: "#856404",
    fontWeight: "600",
    lineHeight: 18,
  },
});
