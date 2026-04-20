import FamilyAPI from "@/features/family/api";
import { MedicationAPI } from "@/features/medication/api";
import FullSizeDropdownComponent from "@/features/record/component/dropdown/variants/FullSize";
import useSubPageTitle from "@/hooks/useSubPageTitle";
import noteInDevelopment from "@/utils/dev";
import { useQuery } from "@tanstack/react-query";
import { useRouter } from "expo-router";
import { Clock, Pill, Plus, ScanLine, Trash2, RotateCw, AlertCircle } from "lucide-react-native";
import { useEffect, useMemo, useState } from "react";
import { ActivityIndicator, ScrollView, StyleSheet, Text, TouchableOpacity, View, Alert } from "react-native";
import useAuth from "@/hooks/useAuth";
import { useMutation, useQueryClient } from "@tanstack/react-query";

export default function MedicationsListPage() {
  useSubPageTitle("Danh sách thuốc");
  const router = useRouter();

  const [familyId, setFamilyId] = useState<string | null>(null);
  const [memberId, setMemberId] = useState<string | null>(null);

  const { data: families = [] } = useQuery({ queryKey: ["families"], queryFn: FamilyAPI.getFamilies });
  const { user } = useAuth();

  const selectedFamily = families.find((f) => f.family_id === familyId);
  const isOwner = selectedFamily?.family_role === "OWNER";

  useEffect(() => {
    if (families.length > 0 && !familyId) setFamilyId(families[0].family_id);
  }, [families]);

  const { data: members = [] } = useQuery({
    queryKey: ["family-members", familyId],
    queryFn: () => FamilyAPI.getMembers(familyId as string),
    enabled: !!familyId,
  });

  useEffect(() => {
    // Nếu là MEMBER (không phải OWNER), mặc định chọn bản thân và khóa dropdown
    if (!isOwner && members.length > 0 && user) {
      const self = members.find((m) => m.user_id === user.id);
      if (self) {
        setMemberId(self.member_id || self.id || null);
      }
    }
  }, [isOwner, members, user]);

  const queryClient = useQueryClient();

  const { data: schedules = [], isFetching, refetch } = useQuery({
    queryKey: ["medications", familyId, memberId],
    queryFn: () => MedicationAPI.getSchedules(familyId!, memberId!),
    enabled: !!familyId && !!memberId,
  });

  const deleteMutation = useMutation({
    mutationFn: (scheduleId: string) => MedicationAPI.deleteSchedule(familyId!, memberId!, scheduleId),
    onSuccess: () => {
      Alert.alert("Thành công", "Đã xóa lịch uống thuốc.");
      refetch();
    },
    onError: (error: any) => {
      Alert.alert("Lỗi", error.response?.data?.message || "Không thể xóa lịch thuốc.");
    }
  });

  const renewMutation = useMutation({
    mutationFn: ({ scheduleId, payload }: { scheduleId: string, payload: any }) => 
      MedicationAPI.updateSchedule(familyId!, memberId!, scheduleId, payload),
    onSuccess: () => {
      Alert.alert("Thành công", "Đã gia hạn lịch uống thuốc.");
      refetch();
    },
    onError: (error: any) => {
      Alert.alert("Lỗi", error.response?.data?.message || "Không thể gia hạn lịch thuốc.");
    }
  });

  const sortedSchedules = useMemo(() => {
    const now = new Date();
    return [...schedules].sort((a, b) => {
      const isExpiredA = a.end_date ? new Date(a.end_date) < now : false;
      const isExpiredB = b.end_date ? new Date(b.end_date) < now : false;
      
      if (isExpiredA && !isExpiredB) return 1;
      if (!isExpiredA && isExpiredB) return -1;
      return new Date(b.start_date).getTime() - new Date(a.start_date).getTime();
    });
  }, [schedules]);

  const handleDelete = (id: string) => {
    Alert.alert(
      "Xác nhận xóa",
      "Bạn có chắc chắn muốn xóa lịch uống thuốc này không?",
      [
        { text: "Hủy", style: "cancel" },
        { text: "Xóa", style: "destructive", onPress: () => deleteMutation.mutate(id) }
      ]
    );
  };

  const handleRenew = (schedule: any) => {
    const now = new Date();
    const originalStart = new Date(schedule.start_date);
    const originalEnd = schedule.end_date ? new Date(schedule.end_date) : null;
    
    let durationDays = 7;
    if (originalEnd) {
      const diffTime = Math.abs(originalEnd.getTime() - originalStart.getTime());
      durationDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)) || 7;
    }

    const newStart = new Date();
    const newEnd = new Date();
    newEnd.setDate(newStart.getDate() + durationDays);

    Alert.alert(
      "Gia hạn lịch thuốc",
      `Bạn có muốn gia hạn lịch thuốc này thêm ${durationDays} ngày (từ hôm nay đến ${newEnd.toLocaleDateString("vi-VN")}) không?`,
      [
        { text: "Hủy", style: "cancel" },
        { 
          text: "Gia hạn ngay", 
          onPress: () => renewMutation.mutate({ 
            scheduleId: schedule._id, 
            payload: { 
              start_date: newStart.toISOString(), 
              end_date: newEnd.toISOString() 
            } 
          }) 
        }
      ]
    );
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Danh sách thuốc của bạn</Text>
        <Text style={styles.subtitle}>Theo dõi và quản lý toa thuốc.</Text>
      </View>

      <View style={styles.actions}>
        <TouchableOpacity style={styles.actionBtn} onPress={() => router.navigate("/protected/medications/scan")}>
          <ScanLine color="#FFF" size={24} />
          <Text style={styles.actionText}>Quét toa thuốc</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.actionBtn, styles.addBtn]}
          onPress={() => {
            router.navigate("/protected/medications/manual");
          }}
        >
          <Plus color="#2C5EDB" size={24} />
          <Text style={[styles.actionText, styles.addBtnText]}>Thêm thủ công</Text>
        </TouchableOpacity>
      </View>

      <View style={{ paddingHorizontal: 24, marginBottom: 16, gap: 12 }}>
        <FullSizeDropdownComponent
          data={families.map((f) => ({ label: f.family_name, value: f.family_id }))}
          defaultValue={familyId}
          onChange={(i: any) => {
            setFamilyId(i.value);
            setMemberId(null);
          }}
        />
        <FullSizeDropdownComponent
          data={members.map((m) => ({ label: m.full_name || m.email || "Hồ sơ khách", value: m.member_id || m.id }))}
          defaultValue={memberId}
          placeholderText="Chọn người thân xem lịch"
          onChange={(i: any) => setMemberId(i.value)}
          disable={!isOwner}
        />
      </View>

      {isFetching ? (
        <ActivityIndicator size="large" color="#2C5EDB" style={{ marginTop: 40 }} />
      ) : sortedSchedules.length > 0 ? (
        <View style={styles.scheduleList}>
          {sortedSchedules.map((schedule) => {
            const isExpired = schedule.end_date ? new Date(schedule.end_date) < new Date() : false;
            
            return (
              <View key={schedule._id} style={[styles.scheduleCard, isExpired && styles.expiredCard]}>
                <View style={styles.cardHeader}>
                  <Text style={[styles.dateRange, isExpired && styles.expiredText]}>
                    Từ: {new Date(schedule.start_date).toLocaleDateString("vi-VN")}
                    {schedule.end_date ? ` - Đến: ${new Date(schedule.end_date).toLocaleDateString("vi-VN")}` : ""}
                  </Text>
                  {isExpired && (
                    <View style={styles.expiredBadge}>
                      <AlertCircle size={12} color="#EF4444" />
                      <Text style={styles.expiredBadgeText}>Đã hết hạn</Text>
                    </View>
                  )}
                </View>

                <View style={styles.sessionBox}>
                  <Clock size={14} color="#6B7280" />
                  <Text style={styles.sessionText}>Giờ nhắc: {schedule.session_times.join(", ")}</Text>
                </View>

                {schedule.medications.map((med, idx) => (
                  <View key={idx} style={styles.medItem}>
                    <Text style={styles.medName}>• {med.name}</Text>
                    <Text style={styles.medSub}>
                      Liều: {med.dosage} | Ngày: {med.days} | {med.frequency}
                    </Text>
                  </View>
                ))}

                {isOwner && (
                  <View style={styles.cardActions}>
                    <TouchableOpacity 
                      style={styles.deleteBtn} 
                      onPress={() => handleDelete(schedule._id)}
                      disabled={deleteMutation.isPending}
                    >
                      <Trash2 size={20} color="#EF4444" />
                    </TouchableOpacity>
                    
                    {isExpired && (
                      <TouchableOpacity 
                        style={styles.renewBtn} 
                        onPress={() => handleRenew(schedule)}
                        disabled={renewMutation.isPending}
                      >
                        <RotateCw size={18} color="#2C5EDB" />
                        <Text style={styles.renewBtnText}>Gia hạn</Text>
                      </TouchableOpacity>
                    )}
                  </View>
                )}
              </View>
            );
          })}
        </View>
      ) : (
        <View style={styles.emptyState}>
          <Pill color="#A0B0C0" size={64} />
          <Text style={styles.emptyText}>{!memberId ? "Chưa chọn thành viên" : "Chưa có loại thuốc nào"}</Text>
          <Text style={styles.emptySubText}>Hãy quét toa thuốc hoặc thêm thuốc thủ công để bắt đầu quản lý.</Text>
        </View>
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F8FBFF",
  },
  header: {
    padding: 24,
    paddingTop: 32,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#1A2A44",
  },
  subtitle: {
    fontSize: 14,
    color: "#4B5C74",
    marginTop: 4,
  },
  actions: {
    flexDirection: "row",
    paddingHorizontal: 24,
    gap: 12,
    marginBottom: 24,
  },
  actionBtn: {
    flex: 1,
    backgroundColor: "#2C5EDB",
    padding: 16,
    borderRadius: 16,
    alignItems: "center",
    gap: 8,
  },
  addBtn: {
    backgroundColor: "#FFF",
    borderWidth: 1,
    borderColor: "#2C5EDB",
  },
  actionText: {
    color: "#FFF",
    fontSize: 14,
    fontWeight: "600",
    textAlign: "center",
  },
  addBtnText: {
    color: "#2C5EDB",
  },
  emptyState: {
    padding: 40,
    alignItems: "center",
    justifyContent: "center",
    marginTop: 40,
  },
  emptyText: {
    fontSize: 18,
    fontWeight: "600",
    color: "#1F2F46",
    marginTop: 16,
  },
  emptySubText: {
    fontSize: 14,
    color: "#4B5C74",
    textAlign: "center",
    marginTop: 8,
  },
  scheduleList: {
    paddingHorizontal: 24,
    paddingBottom: 40,
    gap: 16,
  },
  scheduleCard: {
    backgroundColor: "#fff",
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: "#E7EEF8",
    elevation: 2,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 2 },
  },
  dateRange: {
    fontSize: 16,
    fontWeight: "700",
    color: "#1A2A44",
    marginBottom: 8,
  },
  sessionBox: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#F3F4F6",
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
    alignSelf: "flex-start",
    marginBottom: 12,
    gap: 4,
  },
  sessionText: {
    fontSize: 12,
    color: "#4B5563",
    fontWeight: "600",
  },
  medItem: {
    marginBottom: 8,
  },
  medName: {
    fontSize: 15,
    fontWeight: "600",
    color: "#1F2937",
  },
  medSub: {
    fontSize: 13,
    color: "#6B7280",
    marginLeft: 10,
    marginTop: 2,
  },
  expiredCard: {
    backgroundColor: "#F9FAFB",
    borderColor: "#E5E7EB",
    opacity: 0.8,
  },
  expiredText: {
    color: "#6B7280",
  },
  cardHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 8,
  },
  expiredBadge: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#FEE2E2",
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 12,
    gap: 4,
  },
  expiredBadgeText: {
    fontSize: 10,
    color: "#EF4444",
    fontWeight: "700",
  },
  cardActions: {
    flexDirection: "row",
    justifyContent: "flex-end",
    alignItems: "center",
    marginTop: 16,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: "#F3F4F6",
    gap: 16,
  },
  deleteBtn: {
    padding: 8,
    backgroundColor: "#FEF2F2",
    borderRadius: 8,
  },
  renewBtn: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#EEF2FF",
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 8,
    gap: 6,
  },
  renewBtnText: {
    fontSize: 14,
    color: "#2C5EDB",
    fontWeight: "600",
  },
});
