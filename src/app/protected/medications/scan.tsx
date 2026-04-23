import FamilyAPI from "@/features/family/api";
import { MedicationAPI, PrescriptionExtracted } from "@/features/medication/api";
import FullSizeDropdownComponent from "@/features/record/component/dropdown/variants/FullSize";
import { useIsFocused } from "@react-navigation/native";
import { useMutation, useQuery } from "@tanstack/react-query";
import { CameraType, CameraView, useCameraPermissions } from "expo-camera";
import * as ImagePicker from "expo-image-picker";
import { useRouter } from "expo-router";
import { CheckCircle2, Image as ImageIcon, RotateCcw, Upload, X } from "lucide-react-native";
import React, { useEffect, useRef, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  Image,
  Linking,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import DateTimePicker from "react-native-modal-datetime-picker";

const SESSION_LABELS = ["Sáng", "Trưa", "Chiều", "Tối"];

function parseFrequencyToIndices(frequency?: string): number[] {
  if (!frequency) return [];
  const lower = frequency.toLowerCase();
  const indices: number[] = [];
  if (lower.includes("sáng")) indices.push(0);
  if (lower.includes("trưa")) indices.push(1);
  if (lower.includes("chiều")) indices.push(2);
  if (lower.includes("tối")) indices.push(3);

  if (indices.length === 0) {
    if (lower.includes("2 lần")) return [0, 3];
    if (lower.includes("3 lần")) return [0, 1, 3];
    return [0]; // mặc định sáng
  }
  return indices;
}

export default function ScanPrescriptionScreen() {
  const router = useRouter();
  const isFocused = useIsFocused();
  const [permission, requestPermission] = useCameraPermissions();
  const [facing, setFacing] = useState<CameraType>("back");
  const cameraRef = useRef<CameraView>(null);

  const [imageUri, setImageUri] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState<PrescriptionExtracted[] | null>(null);
  const [editedMeds, setEditedMeds] = useState<any[]>([]);
  const [familyId, setFamilyId] = useState<string | null>(null);
  const [memberId, setMemberId] = useState<string | null>(null);
  const [startDate, setStartDate] = useState<Date>(new Date());
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [sessionTimesGlobal, setSessionTimesGlobal] = useState<string[]>(["08:00", "12:00", "16:00", "20:00"]);

  // State phục vụ việc chọn giờ
  const [isTimePickerVisible, setTimePickerVisible] = useState(false);
  const [pickingTarget, setPickingTarget] = useState<{ medIndex?: number; sessionIndex: number } | null>(null);

  const { data: families = [] } = useQuery({ queryKey: ["families"], queryFn: FamilyAPI.getFamilies });
  const { data: members = [] } = useQuery({
    queryKey: ["family-members", familyId],
    queryFn: () => FamilyAPI.getMembers(familyId as string),
    enabled: !!familyId,
  });

  useEffect(() => {
    if (families.length > 0 && !familyId) setFamilyId(families[0].family_id);
  }, [families, familyId]);

  const createMutation = useMutation({
    mutationFn: (payload: any) => MedicationAPI.createSchedule(familyId!, memberId!, payload),
    onSuccess: () => {
      Alert.alert("Thành công", "Đã lưu lịch thuốc thành công");
      router.replace("/protected/medications");
    },
    onError: (error: any) => {
      Alert.alert("Lỗi", error.response?.data?.message || "Không thể lưu lịch thuốc");
    },
  });

  const handleRequestPermissions = async () => {
    try {
      // Yêu cầu quyền Camera
      const cameraStatus = await requestPermission();
      // Yêu cầu quyền Thư viện ảnh
      const libraryStatus = await ImagePicker.requestMediaLibraryPermissionsAsync();

      console.log("Camera permission:", cameraStatus.status);
      console.log("Library permission:", libraryStatus.status);

      if (!cameraStatus.granted || !libraryStatus.granted) {
        // Nếu bị từ chối và không thể hỏi lại, hướng dẫn người dùng vào Cài đặt
        if (!cameraStatus.canAskAgain || !libraryStatus.canAskAgain) {
          Alert.alert(
            "Quyền truy cập bị chặn",
            "Bạn đã từ chối quyền truy cập. Vui lòng vào Cài đặt để cấp quyền Camera và Thư viện ảnh cho ứng dụng.",
            [
              { text: "Để sau", style: "cancel" },
              { text: "Mở Cài đặt", onPress: () => Linking.openSettings() },
            ]
          );
        }
      }
    } catch (error) {
      console.error("Error requesting permissions:", error);
    }
  };

  useEffect(() => {
    // Chỉ tự động hỏi nếu trạng thái là undetermined hoặc chưa có permission object
    if (permission && permission.status === "undetermined") {
      handleRequestPermissions();
    }
  }, [permission]);

  if (!permission) {
    return (
      <View style={styles.container}>
        <ActivityIndicator size="large" color="#2C5EDB" />
      </View>
    );
  }

  // Fallback UI nếu không có quyền để tránh treo màn hình đen
  if (!permission.granted && permission.status !== "undetermined") {
    return (
      <View
        style={[
          styles.container,
          { backgroundColor: "#fff", padding: 24, alignItems: "center", justifyContent: "center" },
        ]}
      >
        <X color="#ef4444" size={64} />
        <Text style={[styles.resultTitle, { textAlign: "center", marginBottom: 12 }]}>Không có quyền truy cập</Text>
        <Text style={[styles.medDetail, { textAlign: "center", marginBottom: 32 }]}>
          Chúng tôi cần quyền Camera để bạn có thể quét toa thuốc trực tiếp.
        </Text>

        <TouchableOpacity
          style={[styles.primaryBtn, { width: "100%", marginBottom: 12 }]}
          onPress={handleRequestPermissions}
        >
          <Text style={styles.primaryBtnText}>Yêu cầu lại</Text>
        </TouchableOpacity>

        <TouchableOpacity style={[styles.secondaryBtn, { width: "100%" }]} onPress={() => router.back()}>
          <Text style={styles.secondaryBtnText}>Quay lại</Text>
        </TouchableOpacity>
      </View>
    );
  }

  const toggleCameraFacing = () => {
    setFacing((current) => (current === "back" ? "front" : "back"));
  };

  const takePicture = async () => {
    if (cameraRef.current) {
      // Kiểm tra quyền camera lại nếu chưa có
      if (!permission?.granted) {
        const status = await requestPermission();
        if (!status.granted) {
          Alert.alert("Quyền truy cập", "Bạn cần cấp quyền Camera để chụp ảnh toa thuốc.");
          return;
        }
      }

      setIsLoading(true);
      try {
        const photo = await cameraRef.current.takePictureAsync({
          quality: 0.8,
        });
        if (photo) {
          setImageUri(photo.uri);
        }
      } catch (error) {
        Alert.alert("Lỗi", "Không thể chụp ảnh vui lòng thử lại.");
      } finally {
        setIsLoading(false);
      }
    }
  };

  const pickImage = async () => {
    try {
      // Kiểm tra quyền thư viện ảnh lại nếu chưa có
      const { granted } = await ImagePicker.getMediaLibraryPermissionsAsync();
      if (!granted) {
        const request = await ImagePicker.requestMediaLibraryPermissionsAsync();
        if (!request.granted) {
          Alert.alert("Quyền truy cập", "Bạn cần cấp quyền Thư viện ảnh để chọn toa thuốc.");
          return;
        }
      }

      const pickerResult = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ["images"],
        allowsEditing: false,
        quality: 0.8,
      });

      if (!pickerResult.canceled && pickerResult.assets && pickerResult.assets.length > 0) {
        setImageUri(pickerResult.assets[0].uri);
      }
    } catch (error) {
      Alert.alert("Lỗi", "Không thể chọn ảnh từ thư viện.");
    }
  };

  const submitToOCR = async () => {
    if (!imageUri) return;
    setIsLoading(true);
    try {
      // Xác định mime type (mặc định image/jpeg vì expo-camera và picker return jpeg)
      const res = await MedicationAPI.scanPrescription(imageUri, "image/jpeg", "prescription_scan.jpg");

      if (res.status === "success" && res.data.extracted) {
        const indicesMap = res.data.extracted.map((med: any) => parseFrequencyToIndices(med.frequency));

        const parsedMeds = res.data.extracted.map((med: any, idx: number) => {
          const selectedIndices = indicesMap[idx];
          const customTimes = [...sessionTimesGlobal]; // tạo bản sao từ global

          return {
            name: med.name,
            dosage: med.dosage || "",
            frequency: med.frequency || "",
            days: med.days || 1,
            selectedSessions: [0, 1, 2, 3].map((i) => selectedIndices.includes(i)),
            customTimes: customTimes,
          };
        });
        setEditedMeds(parsedMeds);
        setResult(res.data.extracted);
        Alert.alert(
          "Thành công",
          `Đã phân tích xong toa thuốc! (Độ tin cậy: ${Math.round(res.data.confidence * 100)}%)`
        );
      } else {
        Alert.alert("Lỗi", "Không thể trích xuất dữ liệu, vui lòng thủ lại với ảnh rõ nét hơn.");
      }
    } catch (error: any) {
      const msg = error?.response?.data?.message || "Có lỗi khi phân tích ảnh.";
      Alert.alert("Lỗi AI OCR", msg);
    } finally {
      setIsLoading(false);
    }
  };

  const resetScanner = () => {
    setImageUri(null);
    setResult(null);
  };

  const handleSave = () => {
    if (!memberId) {
      Alert.alert("Thiếu thông tin", "Vui lòng chọn thành viên gia đình để gán lịch thuốc.");
      return;
    }

    const formattedMeds = editedMeds.map((m) => {
      // Chỉ lấy các giờ của buổi được chọn
      const medTimes = m.customTimes.filter((_: any, idx: number) => m.selectedSessions[idx]);
      return {
        name: m.name,
        dosage: m.dosage,
        frequency: m.frequency,
        days: m.days,
        times: medTimes,
      };
    });

    const payload = {
      start_date: startDate.toISOString(),
      session_times: sessionTimesGlobal,
      medications: formattedMeds,
    };
    createMutation.mutate(payload);
  };

  const updateMed = (index: number, key: string, value: any) => {
    const newMeds = [...editedMeds];
    newMeds[index] = { ...newMeds[index], [key]: value };
    setEditedMeds(newMeds);
  };

  const openTimePicker = (sessionIndex: number, medIndex?: number) => {
    setPickingTarget({ sessionIndex, medIndex });
    setTimePickerVisible(true);
  };

  const handleTimeConfirm = (date: Date) => {
    const timeStr = date.toLocaleTimeString("en-GB", { hour: "2-digit", minute: "2-digit" });
    if (pickingTarget) {
      const { sessionIndex, medIndex } = pickingTarget;
      if (medIndex !== undefined) {
        // Cập nhật giờ riêng cho thuốc
        const newMeds = [...editedMeds];
        newMeds[medIndex].customTimes[sessionIndex] = timeStr;
        newMeds[medIndex].selectedSessions[sessionIndex] = true; // Tự động chọn buổi nếu chỉnh giờ
        setEditedMeds(newMeds);
      } else {
        // Cập nhật giờ global
        const newGlobal = [...sessionTimesGlobal];
        newGlobal[sessionIndex] = timeStr;
        setSessionTimesGlobal(newGlobal);

        // Hỏi user có muốn áp dụng giờ mới cho tất cả thuốc không
        Alert.alert("Cập nhật giờ", "Bạn có muốn áp dụng giờ này cho tất cả các loại thuốc đang chọn buổi này không?", [
          { text: "Không", style: "cancel" },
          {
            text: "Đồng ý",
            onPress: () => {
              const updatedMeds = editedMeds.map((m) => {
                const newCustom = [...m.customTimes];
                newCustom[sessionIndex] = timeStr;
                return { ...m, customTimes: newCustom };
              });
              setEditedMeds(updatedMeds);
            },
          },
        ]);
      }
    }
    setTimePickerVisible(false);
  };

  const toggleSession = (medIdx: number, sessionIdx: number) => {
    const newMeds = [...editedMeds];
    newMeds[medIdx].selectedSessions[sessionIdx] = !newMeds[medIdx].selectedSessions[sessionIdx];
    setEditedMeds(newMeds);
  };

  if (result) {
    return (
      <ScrollView contentContainerStyle={styles.resultContainer}>
        <View style={styles.resultHeader}>
          <CheckCircle2 color="#22c55e" size={48} />
          <Text style={styles.resultTitle}>Kiểm Tra & Lưu Đơn Thuốc</Text>
        </View>

        <View style={styles.formGroup}>
          <Text style={styles.label}>Gia đình</Text>
          <FullSizeDropdownComponent
            data={families.map((f) => ({ label: f.family_name, value: f.family_id }))}
            defaultValue={familyId}
            onChange={(i: any) => {
              setFamilyId(i.value);
              setMemberId(null);
            }}
          />
        </View>

        <View style={styles.formGroup}>
          <Text style={styles.label}>Thành viên</Text>
          <FullSizeDropdownComponent
            data={members.map((m) => ({ label: m.full_name || m.email || "Hồ sơ khách", value: m.member_id || m.id }))}
            defaultValue={memberId}
            placeholderText="Chọn thành viên"
            onChange={(i: any) => setMemberId(i.value)}
          />
        </View>

        <View style={styles.formGroup}>
          <Text style={styles.label}>Ngày bắt đầu uống liệu trình</Text>
          <TouchableOpacity style={styles.datePickerBtn} onPress={() => setShowDatePicker(true)}>
            <Text>{startDate.toLocaleDateString("vi-VN")}</Text>
          </TouchableOpacity>
        </View>

        <DateTimePicker
          isVisible={showDatePicker}
          mode="date"
          onConfirm={(date) => {
            setStartDate(date);
            setShowDatePicker(false);
          }}
          onCancel={() => setShowDatePicker(false)}
        />

        <DateTimePicker
          isVisible={isTimePickerVisible}
          mode="time"
          onConfirm={handleTimeConfirm}
          onCancel={() => setTimePickerVisible(false)}
        />

        <View style={styles.sessionSettings}>
          <Text style={styles.label}>Cấu hình khung giờ chung (Sáng - Trưa - Chiều - Tối):</Text>
          <View style={styles.sessionRow}>
            {sessionTimesGlobal.map((time, idx) => (
              <TouchableOpacity key={idx} style={styles.sessionTimeBtn} onPress={() => openTimePicker(idx)}>
                <Text style={styles.sessionLabel}>{SESSION_LABELS[idx]}</Text>
                <Text style={styles.sessionValue}>{time}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        <Text style={[styles.resultTitle, { fontSize: 18, alignSelf: "flex-start", marginBottom: 12 }]}>
          Danh sách thuốc & Buổi uống:
        </Text>

        {editedMeds.map((med, index) => (
          <View key={index} style={styles.medCard}>
            <View
              style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "center", marginBottom: 12 }}
            >
              <Text style={styles.medName}>Thuốc #{index + 1}</Text>
              <TouchableOpacity
                onPress={() => {
                  const newMeds = editedMeds.filter((_, i) => i !== index);
                  setEditedMeds(newMeds);
                  if (newMeds.length === 0) setResult(null);
                }}
              >
                <X color="#ef4444" size={20} />
              </TouchableOpacity>
            </View>

            <Text style={styles.label}>Tên thuốc:</Text>
            <TextInput style={styles.input} value={med.name} onChangeText={(t) => updateMed(index, "name", t)} />

            <View style={{ flexDirection: "row", gap: 10 }}>
              <View style={{ flex: 1 }}>
                <Text style={styles.label}>Liều dùng:</Text>
                <TextInput
                  style={styles.input}
                  value={med.dosage}
                  onChangeText={(t) => updateMed(index, "dosage", t)}
                />
              </View>
              <View style={{ flex: 1 }}>
                <Text style={styles.label}>Số ngày:</Text>
                <TextInput
                  style={styles.input}
                  keyboardType="numeric"
                  value={String(med.days)}
                  onChangeText={(t) => updateMed(index, "days", parseInt(t) || 1)}
                />
              </View>
            </View>

            <Text style={styles.label}>Buổi uống & Giờ nhắc (Bấm vào giờ để sửa):</Text>
            <View style={styles.sessionRow}>
              {SESSION_LABELS.map((label, sIdx) => (
                <TouchableOpacity
                  key={sIdx}
                  style={[styles.sessionToggle, med.selectedSessions[sIdx] && styles.sessionToggleActive]}
                  onPress={() => toggleSession(index, sIdx)}
                >
                  <Text style={[styles.toggleLabel, med.selectedSessions[sIdx] && styles.toggleLabelActive]}>
                    {label}
                  </Text>
                  {med.selectedSessions[sIdx] && (
                    <TouchableOpacity onPress={() => openTimePicker(sIdx, index)}>
                      <Text style={styles.toggleTime}>{med.customTimes[sIdx]}</Text>
                    </TouchableOpacity>
                  )}
                </TouchableOpacity>
              ))}
            </View>

            <Text style={styles.label}>Ghi chú thêm:</Text>
            <TextInput
              style={styles.input}
              value={med.frequency}
              onChangeText={(t) => updateMed(index, "frequency", t)}
            />
          </View>
        ))}

        <TouchableOpacity
          style={[styles.primaryBtn, createMutation.isPending && styles.disabledBtn, { marginTop: 16 }]}
          onPress={handleSave}
          disabled={createMutation.isPending}
        >
          <Text style={styles.primaryBtnText}>{createMutation.isPending ? "Đang lưu..." : "Xác Nhận & Lưu DB"}</Text>
        </TouchableOpacity>

        <TouchableOpacity style={[styles.secondaryBtn, { marginTop: 12 }]} onPress={resetScanner}>
          <Text style={styles.secondaryBtnText}>Hủy & Quét Lại</Text>
        </TouchableOpacity>
        <View style={{ height: 40 }} />
      </ScrollView>
    );
  }

  if (imageUri) {
    return (
      <View style={styles.container}>
        <Image source={{ uri: imageUri }} style={styles.previewImage} resizeMode="contain" />

        <View style={styles.previewActions}>
          <TouchableOpacity style={styles.secondaryBtn} onPress={() => setImageUri(null)} disabled={isLoading}>
            <RotateCcw color="#2C5EDB" size={20} />
            <Text style={styles.secondaryBtnText}>Chụp Lại</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.primaryBtn, isLoading && styles.disabledBtn]}
            onPress={submitToOCR}
            disabled={isLoading}
          >
            <Upload color="#FFF" size={20} />
            <Text style={styles.primaryBtnText}>{isLoading ? "Đang phân tích..." : "Phân Tích AI"}</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {isFocused && <CameraView style={StyleSheet.absoluteFill} facing={facing} ref={cameraRef} />}

      <View style={[styles.cameraOverlay, StyleSheet.absoluteFill]}>
        <View style={styles.topControls}>
          <TouchableOpacity style={styles.closeBtn} onPress={() => router.back()}>
            <X color="#FFF" size={28} />
          </TouchableOpacity>
        </View>

        <View style={styles.scanTarget}>
          {/* Khung nhắm đơn giản */}
          <View style={[styles.corner, styles.topLeft]} />
          <View style={[styles.corner, styles.topRight]} />
          <View style={[styles.corner, styles.bottomLeft]} />
          <View style={[styles.corner, styles.bottomRight]} />
          <Text style={styles.scanInstruction}>Căn toa thuốc vào trong khung</Text>
        </View>

        <View style={styles.bottomControls}>
          <TouchableOpacity style={styles.gallaryBtn} onPress={pickImage}>
            <ImageIcon color="#FFF" size={28} />
            <Text style={styles.controlText}>Thư viện</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.captureBtn} onPress={takePicture}>
            <View style={styles.captureBtnInner} />
          </TouchableOpacity>

          <TouchableOpacity style={styles.gallaryBtn} onPress={toggleCameraFacing}>
            <RotateCcw color="#FFF" size={28} />
            <Text style={styles.controlText}>Đổi Cam</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#000",
    justifyContent: "center",
  },
  permissionContainer: {
    padding: 24,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#fff",
    flex: 1,
  },
  permissionText: {
    fontSize: 16,
    textAlign: "center",
    color: "#1F2F46",
    marginBottom: 24,
  },
  camera: {
    flex: 1,
  },
  cameraOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.1)",
    justifyContent: "space-between",
    paddingBottom: 40,
  },
  topControls: {
    paddingTop: 50,
    paddingHorizontal: 20,
    flexDirection: "row",
    justifyContent: "flex-start",
  },
  closeBtn: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: "rgba(0,0,0,0.4)",
    justifyContent: "center",
    alignItems: "center",
  },
  scanTarget: {
    flex: 1,
    marginHorizontal: 30,
    marginTop: 80,
    marginBottom: 40,
    position: "relative",
    justifyContent: "center",
    alignItems: "center",
  },
  scanInstruction: {
    color: "#fff",
    fontSize: 14,
    backgroundColor: "rgba(0,0,0,0.6)",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
    overflow: "hidden",
    marginTop: -80,
  },
  corner: {
    position: "absolute",
    width: 40,
    height: 40,
    borderColor: "#2C5EDB",
  },
  topLeft: {
    top: 0,
    left: 0,
    borderTopWidth: 4,
    borderLeftWidth: 4,
  },
  topRight: {
    top: 0,
    right: 0,
    borderTopWidth: 4,
    borderRightWidth: 4,
  },
  bottomLeft: {
    bottom: 0,
    left: 0,
    borderBottomWidth: 4,
    borderLeftWidth: 4,
  },
  bottomRight: {
    bottom: 0,
    right: 0,
    borderBottomWidth: 4,
    borderRightWidth: 4,
  },
  bottomControls: {
    flexDirection: "row",
    justifyContent: "space-around",
    alignItems: "flex-end",
    width: "100%",
    paddingHorizontal: 20,
    height: 120,
  },
  gallaryBtn: {
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 10,
    gap: 4,
  },
  controlText: {
    color: "#fff",
    fontSize: 12,
  },
  captureBtn: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: "rgba(255, 255, 255, 0.3)",
    justifyContent: "center",
    alignItems: "center",
  },
  captureBtnInner: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: "#fff",
  },
  previewImage: {
    flex: 1,
    width: "100%",
    height: "100%",
  },
  previewActions: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    flexDirection: "row",
    justifyContent: "space-between",
    padding: 24,
    backgroundColor: "rgba(0,0,0,0.6)",
    gap: 16,
  },
  primaryBtn: {
    flex: 1,
    backgroundColor: "#2C5EDB",
    flexDirection: "row",
    height: 52,
    borderRadius: 12,
    justifyContent: "center",
    alignItems: "center",
    gap: 8,
  },
  disabledBtn: {
    backgroundColor: "#8a9ab4",
  },
  primaryBtnText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "700",
  },
  secondaryBtn: {
    flex: 1,
    backgroundColor: "#fff",
    flexDirection: "row",
    height: 52,
    borderWidth: 1,
    borderColor: "#2C5EDB",
    borderRadius: 12,
    justifyContent: "center",
    alignItems: "center",
    gap: 8,
  },
  secondaryBtnText: {
    color: "#2C5EDB",
    fontSize: 16,
    fontWeight: "700",
  },
  resultContainer: {
    padding: 24,
    backgroundColor: "#F8FBFF",
    flexGrow: 1,
  },
  resultHeader: {
    alignItems: "center",
    marginBottom: 24,
    marginTop: 40,
  },
  resultTitle: {
    fontSize: 22,
    fontWeight: "700",
    color: "#1A2A44",
    marginTop: 12,
  },
  medCard: {
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: "#E7EEF8",
    elevation: 1,
    shadowColor: "#000",
    shadowOpacity: 0.05,
    shadowOffset: { width: 0, height: 2 },
  },
  medName: {
    fontSize: 18,
    fontWeight: "700",
    color: "#1F2F46",
    marginBottom: 8,
  },
  medDetail: {
    fontSize: 14,
    color: "#4B5C74",
    marginBottom: 4,
  },
  formGroup: {
    marginBottom: 16,
  },
  label: {
    fontSize: 14,
    fontWeight: "600",
    color: "#4B5C74",
    marginBottom: 8,
    marginTop: 8,
  },
  input: {
    borderWidth: 1,
    borderColor: "#D8E3F5",
    borderRadius: 8,
    backgroundColor: "#fff",
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontSize: 15,
    color: "#1F2F46",
  },
  datePickerBtn: {
    padding: 14,
    borderWidth: 1,
    borderColor: "#D8E3F5",
    borderRadius: 8,
    backgroundColor: "#fff",
  },
  sessionSettings: {
    backgroundColor: "#EEF4FF",
    borderRadius: 12,
    padding: 16,
    marginBottom: 20,
  },
  sessionRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
    marginTop: 8,
  },
  sessionTimeBtn: {
    flex: 1,
    minWidth: "22%",
    backgroundColor: "#fff",
    padding: 8,
    borderRadius: 8,
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#D8E3F5",
  },
  sessionLabel: {
    fontSize: 11,
    color: "#4B5C74",
    fontWeight: "600",
  },
  sessionValue: {
    fontSize: 14,
    color: "#2C5EDB",
    fontWeight: "700",
    marginTop: 2,
  },
  sessionToggle: {
    flex: 1,
    minWidth: "22%",
    backgroundColor: "#F3F4F6",
    padding: 8,
    borderRadius: 8,
    alignItems: "center",
    borderWidth: 1,
    borderColor: "transparent",
  },
  sessionToggleActive: {
    backgroundColor: "#2C5EDB",
    borderColor: "#2C5EDB",
  },
  toggleLabel: {
    fontSize: 12,
    color: "#4B5C74",
  },
  toggleLabelActive: {
    color: "#fff",
    fontWeight: "700",
  },
  toggleTime: {
    fontSize: 11,
    color: "#E0E7FF",
    marginTop: 2,
    textDecorationLine: "underline",
  },
});
