import React, { useState, useEffect } from "react";
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert, ActivityIndicator, ScrollView } from "react-native";
import { CheckCircle2, X, Plus, Calendar, Clock, Trash2 } from "lucide-react-native";
import { useRouter } from "expo-router";
import { useQuery, useMutation } from "@tanstack/react-query";
import FamilyAPI from "@/features/family/api";
import { MedicationAPI } from "@/features/medication/api";
import FullSizeDropdownComponent from "@/features/record/component/dropdown/variants/FullSize";
import DateTimePicker from "react-native-modal-datetime-picker";
import useSubPageTitle from "@/hooks/useSubPageTitle";
import useAuth from "@/hooks/useAuth";

const SESSION_LABELS = ["Sáng", "Trưa", "Chiều", "Tối"];

export default function ManualMedicationScreen() {
  useSubPageTitle("Thêm thuốc thủ công");
  const router = useRouter();

  const [familyId, setFamilyId] = useState<string | null>(null);
  const [memberId, setMemberId] = useState<string | null>(null);
  const [startDate, setStartDate] = useState<Date>(new Date());
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [sessionTimesGlobal, setSessionTimesGlobal] = useState<string[]>(['08:00', '12:00', '16:00', '20:00']);

  // State for medications list
  const [editedMeds, setEditedMeds] = useState<any[]>([
    {
      name: "",
      dosage: "",
      frequency: "",
      days: 1,
      selectedSessions: [true, false, false, false], // Default Morning selected
      customTimes: ['08:00', '12:00', '16:00', '20:00'],
    }
  ]);

  // State for time picking
  const [isTimePickerVisible, setTimePickerVisible] = useState(false);
  const [pickingTarget, setPickingTarget] = useState<{ medIndex?: number, sessionIndex: number } | null>(null);

  const { data: families = [] } = useQuery({ queryKey: ["families"], queryFn: FamilyAPI.getFamilies });
  const { data: members = [] } = useQuery({
    queryKey: ["family-members", familyId],
    queryFn: () => FamilyAPI.getMembers(familyId as string),
    enabled: !!familyId
  });

  const { user } = useAuth();
  const selectedFamily = families.find(f => f.family_id === familyId);
  const isOwner = selectedFamily?.family_role === "OWNER";

  useEffect(() => {
    if (families.length > 0 && !familyId) setFamilyId(families[0].family_id);
  }, [families]);

  useEffect(() => {
    // Nếu là MEMBER (không phải OWNER), mặc định chọn bản thân và khóa dropdown
    if (!isOwner && members.length > 0 && user) {
        const self = members.find(m => m.user_id === user.id);
        if (self) {
            setMemberId(self.member_id || self.id || null);
        }
    }
  }, [isOwner, members, user]);

  const createMutation = useMutation({
    mutationFn: (payload: any) => MedicationAPI.createSchedule(familyId!, memberId!, payload),
    onSuccess: () => {
      Alert.alert("Thành công", "Đã lưu lịch thuốc thành công");
      router.replace("/protected/medications");
    },
    onError: (error: any) => {
      Alert.alert("Lỗi", error.response?.data?.message || "Không thể lưu lịch thuốc");
    }
  });

  const handleAddMedication = () => {
    setEditedMeds([
      ...editedMeds,
      {
        name: "",
        dosage: "",
        frequency: "",
        days: 1,
        selectedSessions: [true, false, false, false],
        customTimes: [...sessionTimesGlobal],
      }
    ]);
  };

  const handleRemoveMedication = (index: number) => {
    if (editedMeds.length === 1) {
      Alert.alert("Thông báo", "Phải có ít nhất một loại thuốc.");
      return;
    }
    const newMeds = editedMeds.filter((_, i) => i !== index);
    setEditedMeds(newMeds);
  };

  const updateMed = (index: number, key: string, value: any) => {
    const newMeds = [...editedMeds];
    newMeds[index] = { ...newMeds[index], [key]: value };
    setEditedMeds(newMeds);
  };

  const toggleSession = (medIdx: number, sessionIdx: number) => {
    const newMeds = [...editedMeds];
    newMeds[medIdx].selectedSessions[sessionIdx] = !newMeds[medIdx].selectedSessions[sessionIdx];
    setEditedMeds(newMeds);
  };

  const openTimePicker = (sessionIndex: number, medIndex?: number) => {
    setPickingTarget({ sessionIndex, medIndex });
    setTimePickerVisible(true);
  };

  const handleTimeConfirm = (date: Date) => {
    const timeStr = date.toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' });
    if (pickingTarget) {
      const { sessionIndex, medIndex } = pickingTarget;
      if (medIndex !== undefined) {
        const newMeds = [...editedMeds];
        newMeds[medIndex].customTimes[sessionIndex] = timeStr;
        newMeds[medIndex].selectedSessions[sessionIndex] = true;
        setEditedMeds(newMeds);
      } else {
        const newGlobal = [...sessionTimesGlobal];
        newGlobal[sessionIndex] = timeStr;
        setSessionTimesGlobal(newGlobal);
        
        Alert.alert(
            "Cập nhật giờ",
            "Bạn có muốn áp dụng giờ này cho tất cả các loại thuốc đang chọn buổi này không?",
            [
              { text: "Không", style: "cancel" },
              { 
                text: "Đồng ý", 
                onPress: () => {
                   const updatedMeds = editedMeds.map(m => {
                       const newCustom = [...m.customTimes];
                       newCustom[sessionIndex] = timeStr;
                       return { ...m, customTimes: newCustom };
                   });
                   setEditedMeds(updatedMeds);
                } 
              }
            ]
        );
      }
    }
    setTimePickerVisible(false);
  };

  const handleSave = () => {
    if (!memberId) {
      Alert.alert("Thiếu thông tin", "Vui lòng chọn thành viên gia đình để gán lịch thuốc.");
      return;
    }

    // Validate medication names
    const invalidMed = editedMeds.find(m => !m.name.trim());
    if (invalidMed) {
        Alert.alert("Thiếu thông tin", "Vui lòng nhập tên thuốc.");
        return;
    }
    
    const formattedMeds = editedMeds.map(m => {
      const medTimes = m.customTimes.filter((_: any, idx: number) => m.selectedSessions[idx]);
      return {
        name: m.name,
        dosage: m.dosage,
        frequency: m.frequency,
        days: m.days,
        times: medTimes
      };
    });

    const payload = {
      start_date: startDate.toISOString(),
      session_times: sessionTimesGlobal,
      medications: formattedMeds
    };
    createMutation.mutate(payload);
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <View style={styles.header}>
        <CheckCircle2 color="#2C5EDB" size={32} />
        <Text style={styles.headerTitle}>Thêm Thuốc Thủ Công</Text>
        <Text style={styles.headerSubtitle}>Nhập thông tin đơn thuốc của người thân</Text>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Thông tin bệnh nhân</Text>
        <View style={styles.formGroup}>
          <Text style={styles.label}>Gia đình</Text>
          <FullSizeDropdownComponent
            data={families.map(f => ({ label: f.family_name, value: f.family_id }))}
            defaultValue={familyId}
            onChange={(i: any) => { setFamilyId(i.value); setMemberId(null); }}
          />
        </View>

        <View style={styles.formGroup}>
          <Text style={styles.label}>Thành viên</Text>
          <FullSizeDropdownComponent
            data={members.map(m => ({ label: m.full_name || m.email || "Hồ sơ khách", value: m.member_id || m.id }))}
            defaultValue={memberId}
            placeholderText="Chọn thành viên"
            onChange={(i: any) => setMemberId(i.value)}
            disable={!isOwner}
          />
        </View>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Cấu hình liệu trình</Text>
        <View style={styles.formGroup}>
          <Text style={styles.label}>Ngày bắt đầu uống</Text>
          <TouchableOpacity style={styles.datePickerBtn} onPress={() => setShowDatePicker(true)}>
            <Calendar size={18} color="#4B5C74" />
            <Text style={styles.dateText}>{startDate.toLocaleDateString('vi-VN')}</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.sessionSettings}>
           <Text style={styles.label}>Giờ nhắc chung toàn đơn thuốc:</Text>
           <View style={styles.sessionRow}>
             {sessionTimesGlobal.map((time, idx) => (
                <TouchableOpacity key={idx} style={styles.sessionTimeBtn} onPress={() => openTimePicker(idx)}>
                    <Text style={styles.sessionLabel}>{SESSION_LABELS[idx]}</Text>
                    <Text style={styles.sessionValue}>{time}</Text>
                </TouchableOpacity>
             ))}
           </View>
        </View>
      </View>

      <View style={styles.medListHeader}>
        <Text style={styles.sectionTitle}>Danh sách thuốc</Text>
        <TouchableOpacity style={styles.addMedBtn} onPress={handleAddMedication}>
            <Plus size={16} color="#2C5EDB" />
            <Text style={styles.addMedText}>Thêm loại thuốc</Text>
        </TouchableOpacity>
      </View>

      {editedMeds.map((med, index) => (
        <View key={index} style={styles.medCard}>
          <View style={styles.medCardHeader}>
               <Text style={styles.medIndexText}>Thuốc #{index + 1}</Text>
               <TouchableOpacity onPress={() => handleRemoveMedication(index)}>
                   <Trash2 color="#ef4444" size={18} />
               </TouchableOpacity>
          </View>

          <View style={styles.formGroup}>
            <Text style={styles.label}>Tên thuốc:</Text>
            <TextInput 
                style={styles.input} 
                placeholder="Ví dụ: Panadol" 
                value={med.name} 
                onChangeText={(t) => updateMed(index, 'name', t)} 
            />
          </View>
          
          <View style={styles.row}>
            <View style={{ flex: 1 }}>
              <Text style={styles.label}>Liều dùng:</Text>
              <TextInput 
                style={styles.input} 
                placeholder="Ví dụ: 1 viên" 
                value={med.dosage} 
                onChangeText={(t) => updateMed(index, 'dosage', t)} 
              />
            </View>
            <View style={{ flex: 1 }}>
              <Text style={styles.label}>Số ngày:</Text>
              <TextInput 
                style={styles.input} 
                keyboardType="numeric" 
                value={String(med.days)} 
                onChangeText={(t) => updateMed(index, 'days', parseInt(t) || 1)} 
              />
            </View>
          </View>

          <Text style={styles.label}>Buổi uống & Giờ nhắc lẻ:</Text>
          <View style={styles.sessionRow}>
              {SESSION_LABELS.map((label, sIdx) => (
                  <TouchableOpacity 
                      key={sIdx} 
                      style={[
                          styles.sessionToggle, 
                          med.selectedSessions[sIdx] && styles.sessionToggleActive
                      ]}
                      onPress={() => toggleSession(index, sIdx)}
                  >
                      <Text style={[styles.toggleLabel, med.selectedSessions[sIdx] && styles.toggleLabelActive]}>{label}</Text>
                      {med.selectedSessions[sIdx] && (
                          <TouchableOpacity onPress={() => openTimePicker(sIdx, index)}>
                              <Text style={styles.toggleTime}>{med.customTimes[sIdx]}</Text>
                          </TouchableOpacity>
                      )}
                  </TouchableOpacity>
              ))}
          </View>

          <View style={styles.formGroup}>
            <Text style={styles.label}>Ghi chú / Tần suất:</Text>
            <TextInput 
                style={styles.input} 
                placeholder="Ví dụ: Uống sau khi ăn" 
                value={med.frequency} 
                onChangeText={(t) => updateMed(index, 'frequency', t)} 
            />
          </View>
        </View>
      ))}

      <View style={styles.actionSection}>
        <TouchableOpacity
          style={[styles.primaryBtn, createMutation.isPending && styles.disabledBtn]}
          onPress={handleSave}
          disabled={createMutation.isPending}
        >
          {createMutation.isPending ? (
            <ActivityIndicator color="#fff" size="small" />
          ) : (
            <Text style={styles.primaryBtnText}>Lưu lịch trình thuốc</Text>
          )}
        </TouchableOpacity>
        
        <TouchableOpacity style={styles.secondaryBtn} onPress={() => router.back()}>
          <Text style={styles.secondaryBtnText}>Hủy bỏ</Text>
        </TouchableOpacity>
      </View>

      <DateTimePicker
        isVisible={showDatePicker}
        mode="date"
        onConfirm={(date) => { setStartDate(date); setShowDatePicker(false); }}
        onCancel={() => setShowDatePicker(false)}
      />

      <DateTimePicker
        isVisible={isTimePickerVisible}
        mode="time"
        onConfirm={handleTimeConfirm}
        onCancel={() => setTimePickerVisible(false)}
      />
      
      <View style={{ height: 40 }} />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 24,
    backgroundColor: '#F8FBFF',
    flexGrow: 1,
  },
  header: {
    alignItems: 'center',
    marginBottom: 24,
    marginTop: 10,
  },
  headerTitle: {
    fontSize: 22,
    fontWeight: '700',
    color: '#1A2A44',
    marginTop: 12,
  },
  headerSubtitle: {
    fontSize: 14,
    color: '#4B5C74',
    marginTop: 4,
  },
  section: {
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#1A2A44',
    marginBottom: 12,
  },
  row: {
    flexDirection: 'row',
    gap: 12,
  },
  formGroup: {
    marginBottom: 16,
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    color: '#4B5C74',
    marginBottom: 8,
  },
  input: {
    borderWidth: 1,
    borderColor: '#D8E3F5',
    borderRadius: 8,
    backgroundColor: '#fff',
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontSize: 15,
    color: '#1F2F46',
  },
  datePickerBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 14,
    borderWidth: 1,
    borderColor: '#D8E3F5',
    borderRadius: 8,
    backgroundColor: '#fff',
    gap: 10,
  },
  dateText: {
    fontSize: 15,
    color: '#1F2F46',
  },
  sessionSettings: {
    backgroundColor: '#EEF4FF',
    borderRadius: 12,
    padding: 16,
    marginTop: 8,
  },
  sessionRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginTop: 8,
  },
  sessionTimeBtn: {
    flex: 1,
    minWidth: '22%',
    backgroundColor: '#fff',
    padding: 8,
    borderRadius: 8,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#D8E3F5',
  },
  sessionLabel: {
    fontSize: 11,
    color: '#4B5C74',
    fontWeight: '600',
  },
  sessionValue: {
    fontSize: 14,
    color: '#2C5EDB',
    fontWeight: '700',
    marginTop: 2,
  },
  medListHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  addMedBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#2C5EDB',
    gap: 6,
  },
  addMedText: {
    fontSize: 13,
    color: '#2C5EDB',
    fontWeight: '600',
  },
  medCard: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#E7EEF8',
    elevation: 2,
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowOffset: { width: 0, height: 2 },
  },
  medCardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
    paddingBottom: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#F3F4F6',
  },
  medIndexText: {
    fontSize: 15,
    fontWeight: '700',
    color: '#1A2A44',
  },
  sessionToggle: {
    flex: 1,
    minWidth: '22%',
    backgroundColor: '#F3F4F6',
    padding: 8,
    borderRadius: 8,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'transparent',
  },
  sessionToggleActive: {
    backgroundColor: '#2C5EDB',
    borderColor: '#2C5EDB',
  },
  toggleLabel: {
    fontSize: 12,
    color: '#4B5C74',
  },
  toggleLabelActive: {
    color: '#fff',
    fontWeight: '700',
  },
  toggleTime: {
    fontSize: 11,
    color: '#E0E7FF',
    marginTop: 2,
    textDecorationLine: 'underline',
  },
  actionSection: {
    marginTop: 10,
    gap: 12,
  },
  primaryBtn: {
    backgroundColor: '#2C5EDB',
    height: 52,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 2,
  },
  primaryBtnText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '700',
  },
  secondaryBtn: {
    height: 52,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#D8E3F5',
    backgroundColor: '#fff',
  },
  secondaryBtnText: {
    color: '#4B5C74',
    fontSize: 16,
    fontWeight: '600',
  },
  disabledBtn: {
    backgroundColor: '#8a9ab4',
  },
});
