import Tag from "@/components/tag";
import { Card, Skeleton } from "@rneui/themed";
import { useRouter } from "expo-router";
import { ClockAlert, RefreshCw } from "lucide-react-native";
import { Pen } from "lucide-react-native/icons";
import { Pressable, Text, View } from "react-native";
import useEmergencyInfo from "../../hooks/useEmergencyInfo";
import { EmergencyInfo } from "../../types";
import { EMERGENCY_INFO_CRITERIA, EMERGENCY_STYLING, toneClassMap } from "./style";

function getEmergencyFieldValue(data: EmergencyInfo | undefined, field: string) {
  if (!data) return null;
  if (field === "medications") return data.current_medications;
  if (field === "blood_type") return data.blood_type;
  if (field === "allergies") return data.allergies;
  if (field === "chronic_diseases") return data.chronic_diseases;
  if (field === "emergency_contacts") return data.emergency_contacts;
  return null;
}

export default function EmergencyDetails() {
  const { data, isPaused, isLoading, refetch } = useEmergencyInfo();
  const router = useRouter();
  if (!data && !isLoading)
    return (
      <View
        className="flex-1 items-center justify-center"
        style={{
          padding: 16,
          height: 220,
          borderWidth: 1,
          borderStyle: "dashed",
          borderColor: "#CBD5E1",
          borderRadius: 20,
        }}
      >
        <Text className="text-slate-500 text-sm text-center">
          Không tìm thấy thông tin khẩn cấp. Bạn hãy bổ sung thông tin này để kết xuất mã QR.
        </Text>

        <Pressable
          className="mt-4 px-10 py-2 rounded-lg bg-teal-600"
          onPress={() => {
            router.push("/protected/userDetails/emergency/update");
          }}
        >
          <Text className="text-white font-bold">Cập nhật thông tin</Text>
        </Pressable>

        <Pressable
          className="mt-4 px-10 py-2 rounded-lg bg-teal-600"
          onPress={() => {
            void refetch();
          }}
        >
          <RefreshCw size={20} color="#FFFFFF" />
        </Pressable>
      </View>
    );
  return isLoading ? (
    <Skeleton animation="wave" width="100%" height={200} style={{ borderRadius: 20 }} />
  ) : (
    <View>
      <Card containerStyle={{ margin: 0, borderRadius: 20, borderColor: "#E2E8F0" }}>
        <View className="flex-row items-center justify-between">
          {isPaused && <ClockAlert size={20} color="#f00" />}
          <Text className="text-slate-900 text-lg font-bold">Thông tin sinh tồn khẩn cấp</Text>
          <Pressable
            className="w-10 h-10 rounded-lg bg-teal-600 flex items-center justify-center"
            onPress={() => {
              router.push("/protected/userDetails/emergency/update");
            }}
          >
            <Pen size={24} color="#FFFFFF" />
          </Pressable>
        </View>

        <View className="mt-4 gap-3">
          {EMERGENCY_INFO_CRITERIA.map((field) => {
            const item = EMERGENCY_STYLING[field as keyof typeof EMERGENCY_STYLING];
            const tone = toneClassMap[item.tone as keyof typeof toneClassMap];
            const Icon = item.icon;
            const value = getEmergencyFieldValue(data, field);

            const Header = (
              <View className="flex-row items-center justify-between">
                <View className="flex-row items-center gap-3">
                  <View className={`h-10 w-10 rounded-xl items-center justify-center ${tone.bg}`}>
                    <Icon size={18} color={tone.icon} />
                  </View>
                  <View>
                    <Text className="text-slate-900 font-semibold">{item.title}</Text>
                  </View>
                </View>
              </View>
            );

            if (field === "emergency_contacts") {
              const contacts = Array.isArray(value)
                ? (value as { name: string; relationship: string; phone: string }[])
                : [];
              return (
                <View key={field} className="rounded-2xl border border-slate-200 bg-white p-4">
                  {Header}
                  <View className="gap-4 flex-col items-start justify-end mt-2">
                    {contacts.length > 0 ? (
                      contacts.map((contact, i) => (
                        <View key={i} className="flex-row items-center gap-2">
                          <Text className={`text-sm font-bold ${tone.value}`}>{contact.name}</Text>
                          <Text className={`text-sm text-slate-500`}>({contact.relationship})</Text>
                          <Text className={`text-sm text-slate-500`}>{contact.phone}</Text>
                        </View>
                      ))
                    ) : (
                      <Text className={`text-sm font-bold text-right ${tone.value}`}>Chưa cập nhật</Text>
                    )}
                  </View>
                </View>
              );
            } else {
              return (
                <View key={field} className="rounded-2xl border border-slate-200 bg-white p-4">
                  {Header}
                  <View className="gap-4 flex-row items-center justify-end mt-2 flex-wrap">
                    {Array.isArray(value) ? (
                      value.map((v, i) => <Tag key={i} title={v as string} />)
                    ) : typeof value === "string" && value.trim() ? (
                      <Text className={`text-sm font-bold text-right ${tone.value}`}>{value}</Text>
                    ) : (
                      <Text className={`text-sm font-bold text-right ${tone.value}`}>Chưa cập nhật</Text>
                    )}
                  </View>
                </View>
              );
            }
          })}
        </View>
      </Card>
    </View>
  );
}
