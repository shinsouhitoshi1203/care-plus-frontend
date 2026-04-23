import LoadingDialog from "@/components/Loading/LoadingDialog";
import QR from "@/components/QR";
import TokenService from "@/features/auth/token";
import FamilyAPI from "@/features/family/api";
import { FamilyMemberItem } from "@/features/family/types";
import QuickLoginAPI from "@/features/quickLogin/api";
import { DeviceItem } from "@/features/quickLogin/types";
import useSubPageTitle from "@/hooks/useSubPageTitle";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { AxiosError } from "axios";
import { useLocalSearchParams, useRouter } from "expo-router";
import {
  LucideBadgeQuestionMark,
  QrCode,
  Shield,
  Smartphone,
  SmartphoneNfc,
  Trash2,
  UserPlus,
} from "lucide-react-native";
import { useRef, useState } from "react";
import { Alert, Modal, Pressable, RefreshControl, ScrollView, StyleSheet, Text, View } from "react-native";
import RNRestart from "react-native-restart";

export default function DeviceManagementPage() {
  useSubPageTitle();
  const needRestart = useRef(false);
  const { familyId } = useLocalSearchParams<{ familyId: string }>();
  const queryClient = useQueryClient();
  const router = useRouter();
  const [setupModalVisible, setSetupModalVisible] = useState(false);
  const [waitModalVisible, setWaitModalVisible] = useState(false);
  const [selectedMember, setSelectedMember] = useState<FamilyMemberItem | null>(null);
  const [setupResult, setSetupResult] = useState<{ device_token: string; member: any } | null>(null);
  const [qrModalVisible, setQrModalVisible] = useState(false);
  const [linkingQRData, setLinkingQRData] = useState<string | null>(null);

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
    mutationFn: async ({ memberId, isQR }: { memberId: string; isQR?: boolean }) => {
      // Nếu là QR, dùng một setup_secret ngẫu nhiên thay vì fingerprint của máy này
      const fingerprint = isQR ? QuickLoginAPI.generateSetupSecret() : await QuickLoginAPI.getOrCreateFingerprint();

      const deviceName = isQR ? `Thiết bị của ${selectedMember?.full_name}` : QuickLoginAPI.getDeviceName();

      const result = await FamilyAPI.setupDevice(familyId!, memberId, {
        device_fingerprint: fingerprint,
        device_name: deviceName,
      });

      return { ...result, setup_secret: fingerprint, isQR };
    },
    onSuccess: async (data) => {
      if (data.isQR) {
        // Tạo dữ liệu QR
        const qrContent = JSON.stringify({
          type: QuickLoginAPI.QR_TYPE,
          device_token: data.device_token,
          setup_secret: data.setup_secret,
        });
        setLinkingQRData(qrContent);
        setQrModalVisible(true);
      } else {
        setSetupResult(data);
        // Lưu device_token vào SecureStore để thiết bị này tự động đăng nhập
        await TokenService.setDeviceToken(data.device_token);
      }
      needRestart.current = true;
      await queryClient.invalidateQueries({ queryKey: ["family-devices", familyId] });
      // Sau khi setup thành công, xóa cache emergency info để các thiết bị khác (nếu có) sẽ refetch và cập nhật lại thông tin đăng nhập nhanh
      queryClient.removeQueries({ queryKey: ["emergency_public_info"] });
      queryClient.removeQueries({ queryKey: ["emergency_public_id"] });
    },
    onError: (error) => {
      const axiosError = error as AxiosError<{ message?: string }>;
      Alert.alert("Thiết lập thất bại", axiosError.response?.data?.message ?? "Có lỗi xảy ra");
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
    setupMutation.mutate({ memberId, isQR: false });
  };

  const handleGenerateQR = (member: FamilyMemberItem) => {
    setSelectedMember(member);
    const memberId = member.member_id || member.id;
    if (!memberId) return;
    setupMutation.mutate({ memberId, isQR: true });
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
    if (needRestart.current) {
      needRestart.current = false;
      setWaitModalVisible(true);
      setTimeout(RNRestart.restart, 500);
    } else {
      setSetupModalVisible(false);
      setSelectedMember(null);
      setSetupResult(null);
    }
  };

  // Devices đã thực sự hoạt động (đã login)
  const activeDevices = devices.filter((d) => d.quick_login_at !== null);

  // Members chưa có thiết bị HOẶC có thiết bị nhưng chưa login (pending)
  // Chỉ những thành viên chưa verify (chưa có user_id) mới được thiết lập đăng nhập nhanh
  const membersWithoutDevice = members.filter((m) => {
    const memberId = m.member_id || m.id;
    const isAlreadyLinked = activeDevices.some((d) => d.member_id === memberId);
    const isVerified = Boolean(m.user_id);

    return !isAlreadyLinked && !isVerified;
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
        show={
          devicesLoading || membersLoading || setupMutation.isPending || revokeMutation.isPending || waitModalVisible
        }
      />

      <ScrollView
        style={styles.container}
        contentContainerStyle={styles.content}
        refreshControl={<RefreshControl refreshing={devicesRefetching} onRefresh={refetchDevices} />}
      >
        {/* Header */}
        <View style={styles.headerBlock}>
          <Text style={styles.heading}>Quản lý thiết bị</Text>
          <Text style={styles.subHeading}>Thiết lập đăng nhập nhanh cho người thân không cần tài khoản</Text>
        </View>

        {/* Hướng dẫn */}
        <View style={styles.infoCard}>
          <View style={{ flexDirection: "row", gap: 12, alignItems: "flex-start" }}>
            <SmartphoneNfc size={20} color="#2C5EDB" />
            <View style={{ flex: 1 }}>
              <Text style={styles.infoTitle}>Đăng nhập nhanh là gì?</Text>
            </View>
          </View>
          <View>
            <Text style={styles.infoText}>
              - Có 2 cách liên kết: Thiết lập trực tiếp trên máy người thân hoặc tạo mã QR để người thân tự quét.
            </Text>
            <Text style={styles.infoText}>
              - Chủ hộ có thể theo dõi trạng thái Chờ quét và thu hồi quyền truy cập bất cứ lúc nào.
            </Text>
            <Pressable onPress={() => router.push("/protected/userDetails/guide")} style={styles.linkButton}>
              <LucideBadgeQuestionMark size={20} color="#2C5EDB" />
              <Text style={styles.backText}>Hướng dẫn liên kết đăng nhập nhanh</Text>
            </Pressable>
          </View>
        </View>

        {/* Danh sách thiết bị đã gán */}
        <View style={styles.card}>
          <View style={styles.cardHeader}>
            <Smartphone size={18} color="#2C5EDB" />
            <Text style={styles.cardTitle}>Thiết bị đã hoạt động ({activeDevices.length})</Text>
          </View>

          {activeDevices.length === 0 ? (
            <Text style={styles.emptyText}>Chưa có thiết bị nào được thiết lập đăng nhập nhanh.</Text>
          ) : (
            <View style={styles.deviceList}>
              {activeDevices.map((device) => (
                <View key={device.member_id} style={styles.deviceItem}>
                  <View style={styles.deviceInfo}>
                    <Text style={styles.deviceName}>{device.display_name ?? "Thành viên"}</Text>
                    <Text style={styles.deviceMeta}>{device.device_name ?? "Thiết bị không rõ"}</Text>
                    {device.family_relation && <Text style={styles.deviceRelation}>{device.family_relation}</Text>}
                    <Text style={styles.deviceLastLogin}>Đăng nhập gần nhất: {formatDate(device.quick_login_at)}</Text>
                  </View>
                  <Pressable onPress={() => handleRevoke(device)} style={styles.revokeButton} hitSlop={8}>
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
            <Text style={styles.emptyText}>Tất cả thành viên đã được thiết lập đăng nhập nhanh.</Text>
          ) : (
            <View style={styles.memberList}>
              {membersWithoutDevice.map((member, index) => {
                const memberId = member.member_id || member.id;
                const isPending = devices.some((d) => d.member_id === memberId && d.quick_login_at === null);

                return (
                  <View key={memberId || `member-${index}`} style={styles.memberSetupItem}>
                    <View style={{ flex: 1 }}>
                      <View style={{ flexDirection: "row", alignItems: "center", gap: 6 }}>
                        <Text style={styles.memberSetupName}>{member.full_name ?? "Thành viên"}</Text>
                        {isPending && (
                          <View style={styles.pendingBadge}>
                            <Text style={styles.pendingBadgeText}>Chờ quét</Text>
                          </View>
                        )}
                      </View>
                      <Text style={styles.memberSetupMeta}>{member.email ?? member.phone ?? "Chưa có thông tin"}</Text>
                    </View>
                    <View style={styles.memberSetupActions}>
                      <Pressable onPress={() => handleSetup(member)} style={styles.setupBadge}>
                        <Smartphone size={14} color="#2C5EDB" />
                        <Text style={styles.setupBadgeText}>Thiết lập</Text>
                      </Pressable>
                      <Pressable
                        onPress={() => handleGenerateQR(member)}
                        style={[styles.setupBadge, { backgroundColor: "#F0F9FF", borderColor: "#B9E6FE" }]}
                      >
                        <QrCode size={14} color="#026AA2" />
                        <Text style={[styles.setupBadgeText, { color: "#026AA2" }]}>Mã QR</Text>
                      </Pressable>
                    </View>
                  </View>
                );
              })}
            </View>
          )}
        </View>
      </ScrollView>

      {/* Modal xác nhận thiết lập. Không cho người dùng bấm backdrop */}
      <Modal visible={setupModalVisible} transparent animationType="fade" onRequestClose={closeSetupModal}>
        <View style={styles.modalOverlay}>
          <Pressable style={styles.modalBackdrop} />
          <View style={styles.modalCard}>
            <View style={styles.modalHeaderRow}>
              <Text style={styles.modalTitle}>{setupResult ? "Thiết lập thành công!" : "Xác nhận thiết lập"}</Text>
              <Pressable onPress={closeSetupModal} hitSlop={8}>
                <Text style={styles.modalCloseText}>Đóng</Text>
              </Pressable>
            </View>

            {!setupResult ? (
              <View style={styles.modalBody}>
                <Shield size={32} color="#2C5EDB" style={{ alignSelf: "center" }} />
                <Text style={styles.modalBodyText}>
                  Thiết lập đăng nhập nhanh cho{" "}
                  <Text style={{ fontWeight: "700" }}>{selectedMember?.full_name ?? "thành viên"}</Text> trên thiết bị
                  này?
                </Text>
                <View style={styles.warningBox}>
                  <Text style={styles.warningText}>Vui lòng đọc kỹ hướng dẫn dưới đây:</Text>
                </View>
                <ScrollView style={{ maxHeight: 150, gap: 12 }}>
                  <Text style={styles.modalBodyHint}>
                    - Thiết bị này sẽ được gán vào thành viên và có thể tự động đăng nhập mà không cần email hay mật
                    khẩu.
                  </Text>
                  <Text style={styles.modalBodyHint}>
                    - Sau khi thiết lập xong, ứng dụng sẽ tự đóng. Bạn cần mở lại trên điện thoại đó để hoàn tất quá
                    trình đăng nhập nhanh.
                  </Text>
                  <Text style={styles.modalBodyHint}>
                    - Bạn phải đảm bảo trước đó không đăng nhập tài khoản chủ hộ ở bất cứ thiết bị nào khác. Nếu đã đăng
                    nhập tài khoản chủ hộ ở thiết bị khác, hãy đăng xuất khỏi thiết bị đó trước khi thiết lập đăng nhập
                    nhanh.
                  </Text>
                </ScrollView>
                <View style={styles.warningBox}>
                  <Shield size={16} color="#856404" />
                  <Text style={styles.warningText}>
                    Quan trọng: Bạn phải thực hiện thao tác này trên điện thoại của người thân.
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
                  Đã thiết lập cho <Text style={{ fontWeight: "700" }}>{setupResult.member.display_name}</Text>
                </Text>
                <Text style={styles.modalBodyHint}>
                  Thiết bị này giờ có thể tự động đăng nhập. Khi mở app lần tới, thành viên sẽ vào thẳng trang chủ mà
                  không cần nhập mật khẩu.
                </Text>
                <View style={styles.modalButtons}>
                  <Pressable onPress={closeSetupModal} style={styles.confirmButton}>
                    <Text style={styles.confirmButtonText}>Hoàn tất</Text>
                  </Pressable>
                </View>
              </View>
            )}
          </View>
        </View>
      </Modal>

      {/* Modal hiển thị mã QR liên kết */}
      <Modal visible={qrModalVisible} transparent animationType="fade" onRequestClose={() => setQrModalVisible(false)}>
        <View style={styles.modalOverlay}>
          <Pressable style={styles.modalBackdrop} onPress={() => setQrModalVisible(false)} />
          <View style={styles.modalCard}>
            <View style={styles.modalHeaderRow}>
              <Text style={styles.modalTitle}>Mã QR liên kết thiết bị</Text>
              <Pressable onPress={() => setQrModalVisible(false)} hitSlop={8}>
                <Text style={styles.modalCloseText}>Đóng</Text>
              </Pressable>
            </View>

            <View style={styles.modalBody}>
              <Text style={styles.modalBodyText}>
                Gửi mã này cho <Text style={{ fontWeight: "700" }}>{selectedMember?.full_name}</Text> để họ quét tại màn
                hình đăng nhập.
              </Text>

              <View style={styles.qrContainer}>{linkingQRData && <QR url={linkingQRData} size={200} />}</View>

              <Text style={styles.modalBodyHint}>
                Mỗi mã QR chỉ dùng được cho một thiết bị. Sau khi quét, thiết bị sẽ tự động được gán và đăng nhập.
              </Text>

              <View style={styles.modalButtons}>
                <Pressable onPress={() => setQrModalVisible(false)} style={styles.confirmButton}>
                  <Text style={styles.confirmButtonText}>Xong</Text>
                </Pressable>
              </View>
            </View>
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
  linkButton: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    marginTop: 8,
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
    backgroundColor: "#EDF4FF",
    borderRadius: 14,
    padding: 14,

    borderWidth: 1,
    borderColor: "#CFE0F9",
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
  pendingBadge: {
    backgroundColor: "#FEF0C7",
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 6,
    borderWidth: 0.5,
    borderColor: "#FEDF89",
  },
  pendingBadgeText: {
    color: "#B54708",
    fontSize: 10,
    fontWeight: "700",
  },
  memberSetupActions: {
    flexDirection: "row",
    gap: 8,
  },
  qrContainer: {
    alignItems: "center",
    justifyContent: "center",
    padding: 20,
    backgroundColor: "#FFFFFF",
    borderRadius: 16,
    borderWidth: 1,
    borderColor: "#F2F4F7",
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
    textAlign: "left",
    lineHeight: 20,
    marginBottom: 10,
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
