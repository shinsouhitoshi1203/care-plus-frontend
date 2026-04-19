import useSubPageTitle from "@/hooks/useSubPageTitle";
import { Card, Divider, ListItem } from "@rneui/themed";
import { BellRing, CircleHelp, HeartPulse, Pill, ShieldAlert, Users } from "lucide-react-native";
import { ScrollView, Text, View } from "react-native";

const quickStart = [
  {
    title: "Thiết lập gia đình",
    desc: "Vào tab Gia đình để tạo gia đình mới hoặc tham gia bằng mã mời/QR.",
    icon: Users,
  },
  {
    title: "Thêm lịch uống thuốc",
    desc: "Vào Thuốc > Quét toa hoặc tạo thủ công để nhận nhắc nhở đúng giờ.",
    icon: Pill,
  },
  {
    title: "Theo dõi hồ sơ sức khỏe",
    desc: "Lưu chỉ số sức khỏe theo từng thành viên để theo dõi lâu dài.",
    icon: HeartPulse,
  },
];

const safetyTips = [
  "Luôn bật thông báo để không bỏ lỡ lịch uống thuốc và cảnh báo SOS.",
  "Kiểm tra lại giờ hệ thống để nhắc thuốc hoạt động chính xác.",
  "Khi đổi thiết bị, hãy đăng xuất thiết bị cũ để bảo mật tài khoản.",
];

export default function UserGuidePage() {
  useSubPageTitle("Hướng dẫn sử dụng");

  return (
    <ScrollView className="flex-1 bg-slate-50" contentContainerStyle={{ padding: 16, gap: 14 }}>
      <Card containerStyle={{ borderRadius: 20, borderColor: "#E2E8F0", margin: 0 }}>
        <View className="flex-row items-start gap-3">
          <View className="h-10 w-10 rounded-xl bg-blue-100 items-center justify-center">
            <CircleHelp size={20} color="#1D4ED8" />
          </View>
          <View className="flex-1">
            <Text className="text-slate-900 text-lg font-bold">Bắt đầu với Care+</Text>
            <Text className="text-slate-600 mt-1 leading-5">
              Ứng dụng giúp gia đình theo dõi sức khỏe, nhận nhắc uống thuốc và xử lý tình huống khẩn cấp nhanh hơn.
            </Text>
          </View>
        </View>
      </Card>

      <Card containerStyle={{ borderRadius: 20, borderColor: "#E2E8F0", margin: 0, paddingVertical: 10 }}>
        <Text className="text-base font-bold text-slate-900 px-4 pt-2 pb-1">3 bước sử dụng nhanh</Text>
        {quickStart.map((item, index) => {
          const Icon = item.icon;
          return (
            <View key={item.title}>
              <ListItem containerStyle={{ paddingVertical: 12, paddingHorizontal: 14 }}>
                <View className="h-9 w-9 rounded-lg bg-emerald-100 items-center justify-center mr-1">
                  <Icon size={18} color="#047857" />
                </View>
                <ListItem.Content>
                  <ListItem.Title className="text-slate-900 font-semibold">{item.title}</ListItem.Title>
                  <ListItem.Subtitle className="text-slate-600 mt-1">{item.desc}</ListItem.Subtitle>
                </ListItem.Content>
              </ListItem>
              {index < quickStart.length - 1 && <Divider />}
            </View>
          );
        })}
      </Card>

      <Card containerStyle={{ borderRadius: 20, borderColor: "#E2E8F0", margin: 0 }}>
        <View className="flex-row items-center gap-2 mb-2">
          <BellRing size={18} color="#7C3AED" />
          <Text className="text-base font-bold text-slate-900">Thông báo nhắc thuốc</Text>
        </View>
        <Text className="text-slate-600 leading-5">
          Nếu đã cấp quyền thông báo, hệ thống sẽ gửi nhắc nhở ngay cả khi máy đang khóa. Hãy kiểm tra phần cài đặt
          thông báo nếu bạn không nhận được nhắc.
        </Text>
      </Card>

      <Card containerStyle={{ borderRadius: 20, borderColor: "#E2E8F0", margin: 0 }}>
        <View className="flex-row items-center gap-2 mb-2">
          <ShieldAlert size={18} color="#DC2626" />
          <Text className="text-base font-bold text-slate-900">Mẹo an toàn</Text>
        </View>
        <View className="gap-2">
          {safetyTips.map((tip) => (
            <View key={tip} className="flex-row items-start gap-2">
              <Text className="text-red-500 mt-0.5">•</Text>
              <Text className="text-slate-600 flex-1 leading-5">{tip}</Text>
            </View>
          ))}
        </View>
      </Card>
    </ScrollView>
  );
}
