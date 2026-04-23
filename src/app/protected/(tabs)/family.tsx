import LoadingDialog from "@/components/Loading/LoadingDialog";

import Scanner from "@/components/QR/Scanner";
import TokenService from "@/features/auth/token";
import FamilyAPI from "@/features/family/api";
import { FamilyItem, FamilyMemberItem } from "@/features/family/types";
import QuickLoginAPI from "@/features/quickLogin/api";
import { SafeAreaContent } from "@/layouts/TabNavigator";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { AxiosError } from "axios";
import { useRouter } from "expo-router";
import { CircleUserRound, Copy, HeartPulse, Plus, QrCode, Smartphone, UserPlus, Users } from "lucide-react-native";

import { useEffect, useMemo, useState } from "react";
import { Alert, Modal, Pressable, RefreshControl, ScrollView, StyleSheet, Text, TextInput, View } from "react-native";

function FamilyPage() {
  const queryClient = useQueryClient();
  const router = useRouter();
  const [selectedFamilyId, setSelectedFamilyId] = useState<string | null>(null);
  const [familyName, setFamilyName] = useState("");
  const [familyAddress, setFamilyAddress] = useState("");
  const [inviteCodeInput, setInviteCodeInput] = useState("");
  const [generatedInvite, setGeneratedInvite] = useState<string | null>(null);
  const [activeSection, setActiveSection] = useState<"overview" | "members">("overview");
  const [activeAction, setActiveAction] = useState<"create" | "join" | "invite" | null>("create");
  const [actionModalVisible, setActionModalVisible] = useState(false);
  const [guestModalVisible, setGuestModalVisible] = useState(false);
  const [guestName, setGuestName] = useState("");
  const [guestRelation, setGuestRelation] = useState("");
  const [scannerVisible, setScannerVisible] = useState(false);
  const [loginType, setLoginType] = useState<string | null>(null);

  const {
    data: families = [],
    isPending: familiesLoading,
    refetch: refetchFamilies,
    isRefetching: familiesRefetching,
  } = useQuery({
    queryKey: ["families"],
    queryFn: FamilyAPI.getFamilies,
  });

  const selectedFamily = useMemo(() => {
    if (!selectedFamilyId) {
      return families[0] ?? null;
    }
    return families.find((item) => item.family_id === selectedFamilyId) ?? families[0] ?? null;
  }, [families, selectedFamilyId]);

  useEffect(() => {
    if (!selectedFamilyId && families.length > 0) {
      setSelectedFamilyId(families[0].family_id);
    }
  }, [families, selectedFamilyId]);

  useEffect(() => {
    const fetchLoginType = async () => {
      const type = await TokenService.getLoginType();
      setLoginType(type);
    };
    fetchLoginType();
  }, []);

  const isOwner = selectedFamily?.family_role === "OWNER";

  const { data: members = [], isFetching: membersFetching } = useQuery({
    queryKey: ["family-members", selectedFamily?.family_id],
    queryFn: () => FamilyAPI.getMembers(selectedFamily?.family_id as string),
    enabled: Boolean(selectedFamily?.family_id),
  });

  const { data: pendingMembers = [], isFetching: pendingFetching } = useQuery({
    queryKey: ["family-pending-members", selectedFamily?.family_id],
    queryFn: () => FamilyAPI.getPendingMembers(selectedFamily?.family_id as string),
    enabled: Boolean(selectedFamily?.family_id && isOwner),
  });

  const createFamilyMutation = useMutation({
    mutationFn: FamilyAPI.createFamily,
    onSuccess: async () => {
      setFamilyName("");
      setFamilyAddress("");
      await queryClient.invalidateQueries({ queryKey: ["families"] });
      Alert.alert("Thành công", "Đã tạo gia đình mới");
    },
    onError: (error) => {
      const axiosError = error as AxiosError<{ message?: string }>;
      Alert.alert("Tạo gia đình thất bại", axiosError.response?.data?.message ?? "Có lỗi xảy ra");
    },
  });

  const joinFamilyMutation = useMutation({
    mutationFn: FamilyAPI.joinByInviteCode,
    onSuccess: async () => {
      setInviteCodeInput("");
      await queryClient.invalidateQueries({ queryKey: ["families"] });
      Alert.alert("Thành công", "Đã gửi yêu cầu tham gia gia đình");
    },
    onError: (error) => {
      const axiosError = error as AxiosError<{ message?: string }>;
      Alert.alert("Tham gia gia đình thất bại", axiosError.response?.data?.message ?? "Có lỗi xảy ra");
    },
  });

  const generateInviteMutation = useMutation({
    mutationFn: FamilyAPI.generateInvite,
    onSuccess: (data) => {
      setGeneratedInvite(data.inviteCode);
      Alert.alert("Mã mời", `Mã mời: ${data.inviteCode}`);
    },
    onError: (error) => {
      const axiosError = error as AxiosError<{ message?: string }>;
      Alert.alert("Tạo mã mời thất bại", axiosError.response?.data?.message ?? "Có lỗi xảy ra");
    },
  });

  const createGuestMemberMutation = useMutation({
    mutationFn: (payload: { displayName: string; relation?: string }) =>
      FamilyAPI.createGuestMember(selectedFamily?.family_id as string, payload),
    onSuccess: () => {
      Alert.alert("Thành công", "Đã tạo tài khoản phụ mới.");
      setGuestModalVisible(false);
      setGuestName("");
      setGuestRelation("");
      queryClient.invalidateQueries({ queryKey: ["family-members", selectedFamily?.family_id] });
    },
    onError: (error) => {
      const axiosError = error as AxiosError<{ message?: string }>;
      Alert.alert("Thất bại", axiosError.response?.data?.message ?? "Lỗi máy chủ");
    },
  });

  const reviewJoinMutation = useMutation({
    mutationFn: FamilyAPI.reviewJoinRequest,
    onSuccess: async () => {
      await Promise.all([
        queryClient.invalidateQueries({ queryKey: ["family-pending-members", selectedFamily?.family_id] }),
        queryClient.invalidateQueries({ queryKey: ["family-members", selectedFamily?.family_id] }),
      ]);
      Alert.alert("Thành công", "Đã cập nhật trạng thái yêu cầu");
    },
    onError: (error) => {
      const axiosError = error as AxiosError<{ message?: string }>;
      Alert.alert("Cập nhật thất bại", axiosError.response?.data?.message ?? "Có lỗi xảy ra");
    },
  });

  const quickLoginMutation = useMutation({
    mutationFn: async ({ token, fingerprint }: { token: string; fingerprint: string }) => {
      return await QuickLoginAPI.loginByDevice(token, fingerprint);
    },
    onSuccess: async (data) => {
      const { tokens } = data;
      await TokenService.setTokens(tokens);
      Alert.alert("Thành công", "Đã liên kết thiết bị thành công!");
      // Có thể reload home hoặc ở lại family
    },
    onError: (error) => {
      console.log("Quick login error:", error);
      Alert.alert("Lỗi", "Không thể liên kết thiết bị này.");
    },
  });

  const handleScan = async (data: string) => {
    try {
      const parsed = JSON.parse(data);
      if (parsed.type === QuickLoginAPI.QR_TYPE && parsed.device_token && parsed.setup_secret) {
        setScannerVisible(false);
        // Lưu data và login (assign thiết bị này)
        await TokenService.setQuickLoginData({
          deviceToken: parsed.device_token,
          fingerprint: parsed.setup_secret,
        });
        await quickLoginMutation.mutateAsync({
          token: parsed.device_token,
          fingerprint: parsed.setup_secret,
        });
      } else {
        Alert.alert("Mã QR không hợp lệ", "Vui lòng quét mã QR liên kết được tạo từ ứng dụng Care+.");
      }
    } catch (e) {
      Alert.alert("Lỗi", "Mã QR không đúng định dạng.");
    }
  };

  const quickStats = useMemo(
    () => ({
      families: families.length,
      members: members.length,
      pending: pendingMembers.length,
    }),
    [families.length, members.length, pendingMembers.length]
  );

  const handleCreateFamily = () => {
    if (!familyName.trim()) {
      Alert.alert("Thiếu thông tin", "Vui lòng nhập tên gia đình");
      return;
    }

    createFamilyMutation.mutate({
      name: familyName.trim(),
      address: familyAddress.trim() || undefined,
    });
  };

  const handleJoinFamily = () => {
    const inviteCode = inviteCodeInput.trim().toUpperCase();
    if (inviteCode.length !== 6) {
      Alert.alert("Mã mời không hợp lệ", "Mã mời cần đủ 6 ký tự");
      return;
    }

    joinFamilyMutation.mutate({ inviteCode });
  };

  const handleReview = (member: FamilyMemberItem, status: "APPROVED" | "REJECTED") => {
    if (!selectedFamily?.family_id || !member.user_id) {
      return;
    }

    reviewJoinMutation.mutate({
      familyId: selectedFamily.family_id,
      memberId: member.user_id,
      status,
    });
  };

  const handleSelectAction = (action: "create" | "join" | "invite") => {
    setActiveAction(action);
    setActionModalVisible(true);
  };

  const closeActionModal = () => {
    setActionModalVisible(false);
    setActiveAction(null);
  };

  return (
    <>
      <LoadingDialog
        show={
          familiesLoading ||
          membersFetching ||
          pendingFetching ||
          createFamilyMutation.isPending ||
          joinFamilyMutation.isPending ||
          generateInviteMutation.isPending ||
          reviewJoinMutation.isPending
        }
      />

      <ScrollView
        style={styles.container}
        contentContainerStyle={styles.content}
        refreshControl={<RefreshControl refreshing={familiesRefetching} onRefresh={refetchFamilies} />}
      >
        <View style={styles.headerBlock}>
          <Text style={styles.heading}>Gia đình</Text>
          <Text style={styles.subHeading}>Quản lý nhóm thành viên và mã mời trong Care+</Text>
        </View>

        {loginType !== "quick_login" && (
          <Pressable style={styles.scannerBanner} onPress={() => setScannerVisible(true)}>
            <QrCode size={20} color="#FFFFFF" />
            <Text style={styles.scannerBannerText}>Quét mã QR liên kết thiết bị</Text>
          </Pressable>
        )}

        <View style={styles.sectionTabs}>
          <Pressable
            onPress={() => setActiveSection("overview")}
            style={[styles.sectionTabButton, activeSection === "overview" && styles.sectionTabButtonActive]}
          >
            <Text style={[styles.sectionTabText, activeSection === "overview" && styles.sectionTabTextActive]}>
              Tổng quan
            </Text>
          </Pressable>
          <Pressable
            onPress={() => setActiveSection("members")}
            style={[styles.sectionTabButton, activeSection === "members" && styles.sectionTabButtonActive]}
          >
            <Text style={[styles.sectionTabText, activeSection === "members" && styles.sectionTabTextActive]}>
              Thành viên
            </Text>
          </Pressable>
        </View>

        <View style={styles.card}>
          <View style={styles.cardHeader}>
            <Users size={18} color="#2C5EDB" />
            <Text style={styles.cardTitle}>Gia đình của tôi</Text>
          </View>
          {families.length === 0 ? (
            <Text style={styles.emptyText}>Bạn chưa thuộc gia đình nào. Tạo mới hoặc nhập mã mời để tham gia.</Text>
          ) : (
            <>
              <View style={styles.familyList}>
                {families.map((family: FamilyItem) => {
                  const isActive = family.family_id === (selectedFamily?.family_id ?? "");
                  return (
                    <Pressable
                      key={family.family_id}
                      onPress={() => setSelectedFamilyId(family.family_id)}
                      style={[styles.familyChip, isActive && styles.familyChipActive]}
                    >
                      <Text style={[styles.familyChipName, isActive && styles.familyChipNameActive]}>
                        {family.family_name}
                      </Text>
                      <Text style={[styles.familyChipMeta, isActive && styles.familyChipNameActive]}>
                        {family.family_role}
                      </Text>
                    </Pressable>
                  );
                })}
              </View>

              {selectedFamily ? (
                <>
                  <Text style={styles.detailText}>{selectedFamily.family_address || "Chưa cập nhật địa chỉ"}</Text>
                  <View style={styles.statsRow}>
                    <View style={styles.statBox}>
                      <Text style={styles.statValue}>{quickStats.members}</Text>
                      <Text style={styles.statLabel}>Thành viên</Text>
                    </View>
                    <View style={styles.statBox}>
                      <Text style={styles.statValue}>{quickStats.pending}</Text>
                      <Text style={styles.statLabel}>Đang chờ</Text>
                    </View>
                  </View>
                </>
              ) : null}
            </>
          )}
        </View>

        {activeSection === "overview" ? (
          <>
            <View style={styles.quickActionGrid}>
              {loginType !== "quick_login" && (
                <Pressable
                  style={[styles.quickActionCard, activeAction === "create" && styles.quickActionCardActive]}
                  onPress={() => handleSelectAction("create")}
                >
                  <Plus size={18} color={activeAction === "create" ? "#FFFFFF" : "#2C5EDB"} />
                  <Text style={[styles.quickActionTitle, activeAction === "create" && styles.quickActionTitleActive]}>
                    Tạo mới
                  </Text>
                </Pressable>
              )}

              {loginType !== "quick_login" && (
                <Pressable
                  style={[styles.quickActionCard, activeAction === "join" && styles.quickActionCardActive]}
                  onPress={() => handleSelectAction("join")}
                >
                  <CircleUserRound size={18} color={activeAction === "join" ? "#FFFFFF" : "#2C5EDB"} />
                  <Text style={[styles.quickActionTitle, activeAction === "join" && styles.quickActionTitleActive]}>
                    Tham gia
                  </Text>
                </Pressable>
              )}

              {isOwner && (
                <Pressable
                  style={[styles.quickActionCard, activeAction === "invite" && styles.quickActionCardActive]}
                  onPress={() => handleSelectAction("invite")}
                >
                  <Copy size={18} color={activeAction === "invite" ? "#FFFFFF" : "#2C5EDB"} />
                  <Text style={[styles.quickActionTitle, activeAction === "invite" && styles.quickActionTitleActive]}>
                    Mã mời
                  </Text>
                </Pressable>
              )}

              {isOwner && (
                <Pressable
                  style={styles.quickActionCard}
                  onPress={() => {
                    if (selectedFamily?.family_id) {
                      router.push(`/protected/family/${selectedFamily.family_id}/devices` as any);
                    }
                  }}
                >
                  <Smartphone size={18} color="#2C5EDB" />
                  <Text style={styles.quickActionTitle}>Thiết bị</Text>
                </Pressable>
              )}

              {isOwner && (
                <Pressable style={styles.quickActionCard} onPress={() => setGuestModalVisible(true)}>
                  <UserPlus size={18} color="#2C5EDB" />
                  <Text style={styles.quickActionTitle}>Tài khoản phụ</Text>
                </Pressable>
              )}
            </View>
          </>
        ) : null}

        {activeSection === "members" ? (
          <View style={styles.card}>
            <Text style={styles.cardTitle}>Thành viên gia đình</Text>
            {!selectedFamily ? (
              <Text style={styles.emptyText}>Hãy chọn một gia đình để xem thành viên.</Text>
            ) : (
              <>
                {members.length === 0 ? (
                  <Text style={styles.emptyText}>Chưa có thành viên nào.</Text>
                ) : (
                  <View style={styles.memberList}>
                    {members.map((member, index) => {
                      // Dùng user_id cho member có tài khoản (tương thích record cũ), member_id cho guest
                      const healthMemberId = member.user_id || member.member_id || member.id;
                      return (
                        <View
                          key={member.user_id ?? member.member_id ?? member.id ?? `member-${index}`}
                          style={styles.memberItem}
                        >
                          <Text style={styles.memberName}>{member.full_name ?? "Chưa cập nhật tên"}</Text>
                          <Text style={styles.memberMeta}>
                            {member.email ??
                              member.phone ??
                              (member.user_id ? "Chưa có thông tin liên hệ" : "Tài khoản phụ")}
                          </Text>
                          <View style={styles.memberActions}>
                            <Text style={styles.memberRole}>{member.family_role}</Text>
                            <Pressable
                              style={styles.healthRecordBtn}
                              onPress={() => {
                                router.push({
                                  pathname: "/protected/records/(list)" as any,
                                  params: { id: healthMemberId },
                                });
                              }}
                            >
                              <HeartPulse size={14} color="#2C5EDB" />
                              <Text style={styles.healthRecordBtnText}>Hồ sơ sức khỏe</Text>
                            </Pressable>
                          </View>
                        </View>
                      );
                    })}
                  </View>
                )}

                {isOwner ? (
                  <>
                    <Text style={styles.cardTitle}>Yêu cầu chờ duyệt</Text>
                    {pendingMembers.length === 0 ? (
                      <Text style={styles.emptyText}>Không có yêu cầu nào đang chờ.</Text>
                    ) : (
                      <View style={styles.memberList}>
                        {pendingMembers.map((member, index) => (
                          <View key={member.user_id ?? member.id ?? `pending-${index}`} style={styles.memberItem}>
                            <Text style={styles.memberName}>{member.full_name ?? "Thành viên"}</Text>
                            <Text style={styles.memberMeta}>{member.email ?? member.phone ?? "Không có liên hệ"}</Text>
                            <View style={styles.reviewButtons}>
                              <Pressable onPress={() => handleReview(member, "APPROVED")} style={styles.approveButton}>
                                <Text style={styles.approveButtonText}>Duyệt</Text>
                              </Pressable>
                              <Pressable onPress={() => handleReview(member, "REJECTED")} style={styles.rejectButton}>
                                <Text style={styles.rejectButtonText}>Từ chối</Text>
                              </Pressable>
                            </View>
                          </View>
                        ))}
                      </View>
                    )}
                  </>
                ) : null}
              </>
            )}
          </View>
        ) : null}
        <SafeAreaContent />
      </ScrollView>

      <Modal visible={actionModalVisible} transparent animationType="fade" onRequestClose={closeActionModal}>
        <View style={styles.modalOverlay}>
          <Pressable style={styles.modalBackdrop} onPress={closeActionModal} />
          <View style={styles.modalCard}>
            <View style={styles.modalHeaderRow}>
              <Text style={styles.modalTitle}>Thao tác gia đình</Text>
              <Pressable onPress={closeActionModal} hitSlop={8}>
                <Text style={styles.modalCloseText}>Đóng</Text>
              </Pressable>
            </View>

            {activeAction === "create" ? (
              <View style={styles.modalBody}>
                <View style={styles.cardHeader}>
                  <Plus size={18} color="#2C5EDB" />
                  <Text style={styles.cardTitle}>Tạo gia đình mới</Text>
                </View>
                <TextInput
                  value={familyName}
                  onChangeText={setFamilyName}
                  placeholder="Tên gia đình"
                  style={styles.input}
                  placeholderTextColor="#8A96A8"
                />
                <TextInput
                  value={familyAddress}
                  onChangeText={setFamilyAddress}
                  placeholder="Địa chỉ (không bắt buộc)"
                  style={styles.input}
                  placeholderTextColor="#8A96A8"
                />
                <Pressable onPress={handleCreateFamily} style={styles.primaryButton}>
                  <Text style={styles.primaryButtonText}>Tạo gia đình</Text>
                </Pressable>
              </View>
            ) : null}

            {activeAction === "join" ? (
              <View style={styles.modalBody}>
                <View style={styles.cardHeader}>
                  <CircleUserRound size={18} color="#2C5EDB" />
                  <Text style={styles.cardTitle}>Tham gia bằng mã mời</Text>
                </View>
                <TextInput
                  value={inviteCodeInput}
                  onChangeText={setInviteCodeInput}
                  placeholder="Nhập mã 6 ký tự"
                  autoCapitalize="characters"
                  maxLength={6}
                  style={styles.input}
                  placeholderTextColor="#8A96A8"
                />
                <Pressable onPress={handleJoinFamily} style={styles.secondaryButton}>
                  <Text style={styles.secondaryButtonText}>Gửi yêu cầu tham gia</Text>
                </Pressable>
              </View>
            ) : null}

            {activeAction === "invite" ? (
              isOwner && selectedFamily ? (
                <View style={styles.modalBody}>
                  <View style={styles.cardHeader}>
                    <Copy size={18} color="#2C5EDB" />
                    <Text style={styles.cardTitle}>Mã mời gia đình</Text>
                  </View>
                  <Text style={styles.detailText}>Gia đình: {selectedFamily.family_name}</Text>
                  <Pressable
                    onPress={() => generateInviteMutation.mutate(selectedFamily.family_id)}
                    style={styles.secondaryButton}
                  >
                    <Text style={styles.secondaryButtonText}>Tạo mã mời mới (5 phút)</Text>
                  </Pressable>
                  {generatedInvite ? <Text style={styles.generatedInvite}>Mã hiện tại: {generatedInvite}</Text> : null}
                </View>
              ) : (
                <View style={styles.modalBody}>
                  <Text style={styles.emptyText}>Bạn cần quyền OWNER để tạo mã mời.</Text>
                </View>
              )
            ) : null}
          </View>
        </View>
      </Modal>

      {/* Modal tạo tài khoản phụ */}
      <Modal
        visible={guestModalVisible}
        transparent
        animationType="fade"
        onRequestClose={() => setGuestModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <Pressable style={styles.modalBackdrop} onPress={() => setGuestModalVisible(false)} />
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Thêm tài khoản phụ</Text>
            <Text style={styles.modalDescription}>
              Tạo hồ sơ cho người thân (ông bà, trẻ nhỏ) không dùng tài khoản riêng.
            </Text>
            <View style={styles.inputGroup}>
              <Text style={styles.label}>Tên hiển thị (Bắt buộc)</Text>
              <TextInput
                style={styles.input}
                placeholder="Ví dụ: Ông nội, Bé Bi..."
                value={guestName}
                onChangeText={setGuestName}
                placeholderTextColor="#A0AEC0"
              />
            </View>
            <View style={styles.inputGroup}>
              <Text style={styles.label}>Quan hệ (Không bắt buộc)</Text>
              <TextInput
                style={styles.input}
                placeholder="Ví dụ: Cha, Con..."
                value={guestRelation}
                onChangeText={setGuestRelation}
                placeholderTextColor="#A0AEC0"
              />
            </View>
            <View style={styles.modalActions}>
              <Pressable style={styles.cancelBtn} onPress={() => setGuestModalVisible(false)}>
                <Text style={styles.cancelBtnText}>Hủy</Text>
              </Pressable>
              <Pressable
                style={[styles.confirmBtn, !guestName && styles.confirmBtnDisabled]}
                onPress={() => createGuestMemberMutation.mutate({ displayName: guestName, relation: guestRelation })}
                disabled={createGuestMemberMutation.isPending || !guestName}
              >
                <Text style={styles.confirmBtnText}>
                  {createGuestMemberMutation.isPending ? "Đang tạo..." : "Tạo ngay"}
                </Text>
              </Pressable>
            </View>
          </View>
        </View>
      </Modal>

      <Modal visible={scannerVisible} animationType="slide" onRequestClose={() => setScannerVisible(false)}>
        <Scanner onScan={handleScan} onClose={() => setScannerVisible(false)} title="Quét mã liên kết thiết bị" />
      </Modal>

      <LoadingDialog show={quickLoginMutation.isPending} />
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
  scannerBanner: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#2C5EDB",
    borderRadius: 14,
    paddingVertical: 12,
    gap: 8,
    marginBottom: 10,
    shadowColor: "#2C5EDB",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 4,
  },
  scannerBannerText: {
    color: "#FFFFFF",
    fontSize: 15,
    fontWeight: "700",
  },
  sectionTabs: {
    flexDirection: "row",
    backgroundColor: "#EDF3FC",
    borderRadius: 14,
    padding: 4,
    marginBottom: 2,
  },
  sectionTabButton: {
    flex: 1,
    borderRadius: 10,
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 8,
  },
  sectionTabButtonActive: {
    backgroundColor: "#FFFFFF",
  },
  sectionTabText: {
    color: "#5E6E85",
    fontSize: 13,
    fontWeight: "600",
  },
  sectionTabTextActive: {
    color: "#1D3556",
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
  detailText: {
    color: "#4B5C74",
    fontSize: 13,
  },
  statsRow: {
    flexDirection: "row",
    gap: 8,
    marginTop: 6,
  },
  statBox: {
    flex: 1,
    backgroundColor: "#F4F8FE",
    borderRadius: 10,
    paddingVertical: 10,
    alignItems: "center",
  },
  statValue: {
    color: "#1E3758",
    fontWeight: "700",
    fontSize: 18,
  },
  statLabel: {
    color: "#667993",
    fontSize: 12,
    marginTop: 2,
  },
  familyList: {
    gap: 8,
  },
  familyChip: {
    borderWidth: 1,
    borderColor: "#CFE0F9",
    borderRadius: 12,
    padding: 10,
  },
  familyChipActive: {
    backgroundColor: "#2C5EDB",
    borderColor: "#2C5EDB",
  },
  familyChipName: {
    color: "#23344D",
    fontWeight: "700",
  },
  familyChipNameActive: {
    color: "#FFFFFF",
  },
  familyChipMeta: {
    marginTop: 2,
    color: "#62748D",
    fontSize: 12,
    textTransform: "uppercase",
  },
  input: {
    borderWidth: 1,
    borderColor: "#D8E3F5",
    borderRadius: 12,
    backgroundColor: "#FBFDFF",
    paddingHorizontal: 12,
    paddingVertical: 10,
    color: "#21334B",
    fontSize: 15,
  },
  quickActionGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
    gap: 10,
    // marginBottom: 40,
  },
  quickActionCard: {
    flex: 1,
    minWidth: 120,
    height: 80,
    borderWidth: 1,
    borderColor: "#DAE5F7",
    borderRadius: 12,
    backgroundColor: "#FFFFFF",
    padding: 10,
    gap: 4,
    alignItems: "center",
    justifyContent: "center",
  },
  quickActionCardActive: {
    borderColor: "#2C5EDB",
    backgroundColor: "#2C5EDB",
  },
  quickActionCardDisabled: {
    opacity: 0.6,
  },
  quickActionTitle: {
    color: "#253A59",
    fontWeight: "700",
    fontSize: 13,
  },
  quickActionTitleActive: {
    color: "#FFFFFF",
  },
  quickActionDesc: {
    color: "#6E7E95",
    fontSize: 12,
    lineHeight: 18,
  },
  primaryButton: {
    backgroundColor: "#2C5EDB",
    borderRadius: 12,
    paddingVertical: 11,
    alignItems: "center",
  },
  primaryButtonText: {
    color: "#FFFFFF",
    fontWeight: "700",
    fontSize: 15,
  },
  secondaryButton: {
    borderRadius: 12,
    paddingVertical: 11,
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#2C5EDB",
    backgroundColor: "#F2F7FF",
  },
  secondaryButtonText: {
    color: "#2C5EDB",
    fontWeight: "700",
    fontSize: 15,
  },
  generatedInvite: {
    color: "#2C5EDB",
    fontWeight: "700",
    fontSize: 16,
    letterSpacing: 1,
  },
  memberList: {
    gap: 10,
  },
  memberItem: {
    borderWidth: 1,
    borderColor: "#E2EAF6",
    backgroundColor: "#FCFEFF",
    borderRadius: 12,
    padding: 10,
    gap: 4,
  },
  memberName: {
    color: "#1B2A40",
    fontWeight: "700",
    fontSize: 15,
  },
  memberMeta: {
    color: "#607188",
    fontSize: 13,
  },
  memberRole: {
    marginTop: 2,
    color: "#2C5EDB",
    fontSize: 12,
    fontWeight: "700",
    textTransform: "uppercase",
  },
  memberActions: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: 4,
  },
  healthRecordBtn: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    backgroundColor: "#EDF3FC",
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 8,
  },
  healthRecordBtnText: {
    color: "#2C5EDB",
    fontSize: 12,
    fontWeight: "700",
  },
  reviewButtons: {
    flexDirection: "row",
    gap: 10,
    marginTop: 8,
  },
  approveButton: {
    flex: 1,
    backgroundColor: "#2C5EDB",
    borderRadius: 10,
    paddingVertical: 8,
    alignItems: "center",
  },
  approveButtonText: {
    color: "#FFFFFF",
    fontWeight: "700",
  },
  rejectButton: {
    flex: 1,
    borderRadius: 10,
    paddingVertical: 8,
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#AAB8CC",
    backgroundColor: "#F4F7FB",
  },
  rejectButtonText: {
    color: "#42536B",
    fontWeight: "700",
  },
  emptyText: {
    color: "#6F7E96",
    fontSize: 14,
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
    gap: 12,
  },
  modalContent: {
    backgroundColor: "#FFFFFF",
    borderRadius: 18,
    padding: 16,
    borderWidth: 1,
    borderColor: "#DCE7F8",
    gap: 12,
  },
  modalDescription: {
    fontSize: 13,
    color: "#66758D",
    lineHeight: 18,
  },
  inputGroup: {
    gap: 4,
  },
  label: {
    fontSize: 13,
    fontWeight: "700",
    color: "#4B5C74",
  },
  modalActions: {
    flexDirection: "row",
    gap: 10,
    marginTop: 8,
  },
  cancelBtn: {
    flex: 1,
    borderRadius: 12,
    paddingVertical: 11,
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#AAB8CC",
    backgroundColor: "#F4F7FB",
  },
  cancelBtnText: {
    color: "#42536B",
    fontWeight: "700",
    fontSize: 15,
  },
  confirmBtn: {
    flex: 1,
    backgroundColor: "#2C5EDB",
    borderRadius: 12,
    paddingVertical: 11,
    alignItems: "center",
  },
  confirmBtnDisabled: {
    backgroundColor: "#AAB8CC",
  },
  confirmBtnText: {
    color: "#FFFFFF",
    fontWeight: "700",
    fontSize: 15,
  },
});

export default FamilyPage;
