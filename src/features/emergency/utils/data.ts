import { Cross, Flame } from "lucide-react-native";
import { Shield } from "lucide-react-native/icons";

export const HOTLINES = [
  {
    title: "Y tế (115)",
    number: "115",
    icon: Cross,
    bg: "error",
    description: "Đường dây nóng y tế khẩn cấp, hỗ trợ trong các tình huống cấp cứu liên quan đến sức khỏe.",
  },
  {
    title: "Cứu hỏa (114)",
    number: "114",
    icon: Flame,
    bg: "warning",

    description:
      "Đường dây nóng cứu hỏa, hỗ trợ trong các tình huống cháy nổ, tai nạn giao thông hoặc các sự cố liên quan đến an toàn cháy nổ.",
  },
  {
    title: "Cảnh sát (113)",
    number: "113",
    icon: Shield,
    bg: "primary",
    description:
      "Đường dây nóng cảnh sát, hỗ trợ trong các tình huống liên quan đến an ninh, trộm cắp, bạo lực hoặc các sự cố liên quan đến an toàn công cộng.",
  },
];
