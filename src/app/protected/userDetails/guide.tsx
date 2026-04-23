import useSubPageTitle from "@/hooks/useSubPageTitle";
import { Card, Divider, ListItem } from "@rneui/themed";
import {
  BellRing,
  CircleHelp,
  HeartPulse,
  QrCode,
  ShieldAlert,
  Smartphone,
  SmartphoneNfc,
  Users,
} from "lucide-react-native";
import { ScrollView, Text, View } from "react-native";

const quickStart = [
  {
    title: "Thiết lập gia đình",
    desc: "Vào tab Gia đình để tạo gia đình mới hoặc tham gia bằng mã mời/QR.",
    icon: Users,
  },
  {
    title: "Liên kết đăng nhập nhanh",
    desc: "Vào Gia đình > Quản lý thiết bị để liên kết điện thoại cho người thân.",
    icon: SmartphoneNfc,
  },
  {
    title: "Theo dõi hồ sơ sức khỏe",
    desc: "Lưu chỉ số sức khỏe theo từng thành viên để theo dõi lâu dài.",
    icon: HeartPulse,
  },
];

const directSetupSteps = [
  {
    title: "Mở đúng màn hình",
    desc: "Vào tab Gia đình > Quản lý thiết bị > Thêm thiết bị mới.",
  },
  {
    title: "Nhấn Thiết lập ở thành viên cần gán",
    desc: "Chỉ áp dụng với thành viên chưa xác minh (chưa có tài khoản đầy đủ).",
  },
  {
    title: "Xác nhận và mở lại ứng dụng",
    desc: "Sau khi thiết lập, ứng dụng sẽ tự khởi động lại để hoàn tất đăng nhập nhanh trên máy đó.",
  },
];

const qrSetupSteps = [
  "Trong Quản lý thiết bị, nhấn Mã QR tại thành viên cần liên kết.",
  "Gửi mã cho người thân quét tại màn hình đăng nhập của Care+.",
  "Sau khi quét thành công, trạng thái Chờ quét sẽ chuyển sang thiết bị đã hoạt động.",
];

const safetyTips = [
  "Luôn bật thông báo để không bỏ lỡ lịch uống thuốc và cảnh báo SOS.",
  "Khi thiết lập đăng nhập nhanh, hãy thao tác trên đúng điện thoại của người thân.",
  "Nếu đổi máy hoặc làm mất máy, vào Gia đình > Quản lý thiết bị để Thu hồi ngay.",
  "Không dùng đăng nhập nhanh trên thiết bị đang đăng nhập tài khoản chủ hộ.",
  "Kiểm tra lại giờ hệ thống để nhắc thuốc hoạt động chính xác.",
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
          <SmartphoneNfc size={18} color="#2C5EDB" />
          <Text className="text-base font-bold text-slate-900">Liên kết đăng nhập nhanh</Text>
        </View>
        <Text className="text-slate-600 leading-5 mb-3">
          Tính năng này giúp ông/bà hoặc trẻ nhỏ vào ứng dụng mà không cần nhớ mật khẩu. Chủ hộ có thể thu hồi quyền
          truy cập bất cứ lúc nào trong mục Quản lý thiết bị.
        </Text>

        <View className="rounded-2xl border border-blue-100 bg-blue-50 p-3 gap-2">
          <View className="flex-row items-center gap-2">
            <Smartphone size={16} color="#1D4ED8" />
            <Text className="text-slate-900 font-bold">Cách 1: Thiết lập trực tiếp</Text>
          </View>
          {directSetupSteps.map((step, index) => (
            <View key={step.title} className="flex-row items-start gap-2">
              <View className="h-5 w-5 rounded-full bg-blue-200 items-center justify-center mt-0.5">
                <Text className="text-blue-800 text-[11px] font-bold">{index + 1}</Text>
              </View>
              <View className="flex-1">
                <Text className="text-slate-900 font-semibold">{step.title}</Text>
                <Text className="text-slate-600 leading-5">{step.desc}</Text>
              </View>
            </View>
          ))}
        </View>

        <View className="rounded-2xl border border-cyan-100 bg-cyan-50 p-3 gap-2 mt-3">
          <View className="flex-row items-center gap-2">
            <QrCode size={16} color="#0E7490" />
            <Text className="text-slate-900 font-bold">Cách 2: Liên kết bằng mã QR</Text>
          </View>
          {qrSetupSteps.map((step) => (
            <View key={step} className="flex-row items-start gap-2">
              <Text className="text-cyan-700 mt-0.5">•</Text>
              <Text className="text-slate-600 flex-1 leading-5">{step}</Text>
            </View>
          ))}
        </View>
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
