import useSubPageTitle from "@/hooks/useSubPageTitle";
import { useRouter } from "expo-router";
import { ScrollView, View, Text, StyleSheet, TouchableOpacity, ActivityIndicator } from "react-native";
import { Pill, ScanLine, Plus, Clock } from "lucide-react-native";
import { useQuery } from "@tanstack/react-query";
import FamilyAPI from "@/features/family/api";
import { MedicationAPI } from "@/features/medication/api";
import FullSizeDropdownComponent from "@/features/record/component/dropdown/variants/FullSize";
import { useState, useEffect } from "react";

export default function MedicationsListPage() {
  useSubPageTitle("Danh sách thuốc");
  const router = useRouter();

  const [familyId, setFamilyId] = useState<string | null>(null);
  const [memberId, setMemberId] = useState<string | null>(null);

  const { data: families = [] } = useQuery({ queryKey: ["families"], queryFn: FamilyAPI.getFamilies });
  
  useEffect(() => {
    if (families.length > 0 && !familyId) setFamilyId(families[0].family_id);
  }, [families]);

  const { data: members = [] } = useQuery({ 
      queryKey: ["family-members", familyId], 
      queryFn: () => FamilyAPI.getMembers(familyId as string),
      enabled: !!familyId 
  });

  const { data: schedules = [], isFetching } = useQuery({
      queryKey: ["medications", familyId, memberId],
      queryFn: () => MedicationAPI.getSchedules(familyId!, memberId!),
      enabled: !!familyId && !!memberId
  });

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
        
        <TouchableOpacity style={[styles.actionBtn, styles.addBtn]} onPress={() => {}}>
          <Plus color="#2C5EDB" size={24} />
          <Text style={[styles.actionText, styles.addBtnText]}>Thêm thủ công</Text>
        </TouchableOpacity>
      </View>
      
      <View style={{ paddingHorizontal: 24, marginBottom: 16, gap: 12 }}>
         <FullSizeDropdownComponent 
            data={families.map(f => ({ label: f.family_name, value: f.family_id }))} 
            defaultValue={familyId}
            onChange={(i: any) => { setFamilyId(i.value); setMemberId(null); }}
          />
          <FullSizeDropdownComponent 
            data={members.map(m => ({ label: m.full_name || m.email || "Hồ sơ khách", value: m.member_id || m.id }))} 
            defaultValue={memberId}
            placeholderText="Chọn người thân xem lịch"
            onChange={(i: any) => setMemberId(i.value)}
          />
      </View>

      {isFetching ? (
          <ActivityIndicator size="large" color="#2C5EDB" style={{ marginTop: 40 }} />
      ) : schedules.length > 0 ? (
         <View style={styles.scheduleList}>
            {schedules.map((schedule) => (
                <View key={schedule._id} style={styles.scheduleCard}>
                    <Text style={styles.dateRange}>
                        Từ: {new Date(schedule.start_date).toLocaleDateString("vi-VN")} 
                        {schedule.end_date ? ` - Đến: ${new Date(schedule.end_date).toLocaleDateString("vi-VN")}` : ''}
                    </Text>
                    
                    <View style={styles.sessionBox}>
                        <Clock size={14} color="#6B7280" />
                        <Text style={styles.sessionText}>Giờ nhắc: {schedule.session_times.join(', ')}</Text>
                    </View>

                    {schedule.medications.map((med, idx) => (
                        <View key={idx} style={styles.medItem}>
                            <Text style={styles.medName}>• {med.name}</Text>
                            <Text style={styles.medSub}>Liều: {med.dosage} | Ngày: {med.days} | {med.frequency}</Text>
                        </View>
                    ))}
                </View>
            ))}
         </View>
      ) : (
        <View style={styles.emptyState}>
          <Pill color="#A0B0C0" size={64} />
          <Text style={styles.emptyText}>{!memberId ? 'Chưa chọn thành viên' : 'Chưa có loại thuốc nào'}</Text>
          <Text style={styles.emptySubText}>Hãy quét toa thuốc hoặc thêm thuốc thủ công để bắt đầu quản lý.</Text>
        </View>
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8FBFF',
  },
  header: {
    padding: 24,
    paddingTop: 32,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#1A2A44',
  },
  subtitle: {
    fontSize: 14,
    color: '#4B5C74',
    marginTop: 4,
  },
  actions: {
    flexDirection: 'row',
    paddingHorizontal: 24,
    gap: 12,
    marginBottom: 24,
  },
  actionBtn: {
    flex: 1,
    backgroundColor: '#2C5EDB',
    padding: 16,
    borderRadius: 16,
    alignItems: 'center',
    gap: 8,
  },
  addBtn: {
    backgroundColor: '#FFF',
    borderWidth: 1,
    borderColor: '#2C5EDB',
  },
  actionText: {
    color: '#FFF',
    fontSize: 14,
    fontWeight: '600',
    textAlign: 'center',
  },
  addBtnText: {
    color: '#2C5EDB',
  },
  emptyState: {
    padding: 40,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 40,
  },
  emptyText: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1F2F46',
    marginTop: 16,
  },
  emptySubText: {
    fontSize: 14,
    color: '#4B5C74',
    textAlign: 'center',
    marginTop: 8,
  },
  scheduleList: {
    paddingHorizontal: 24,
    paddingBottom: 40,
    gap: 16
  },
  scheduleCard: {
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: '#E7EEF8',
    elevation: 2,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 2 },
  },
  dateRange: {
    fontSize: 16,
    fontWeight: '700',
    color: '#1A2A44',
    marginBottom: 8,
  },
  sessionBox: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F3F4F6',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
    alignSelf: 'flex-start',
    marginBottom: 12,
    gap: 4
  },
  sessionText: {
    fontSize: 12,
    color: '#4B5563',
    fontWeight: '600'
  },
  medItem: {
    marginBottom: 8,
  },
  medName: {
    fontSize: 15,
    fontWeight: '600',
    color: '#1F2937',
  },
  medSub: {
    fontSize: 13,
    color: '#6B7280',
    marginLeft: 10,
    marginTop: 2
  }
});
