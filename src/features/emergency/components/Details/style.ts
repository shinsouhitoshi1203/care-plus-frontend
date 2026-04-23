import { AlertCircle, Contact, Droplet, Pill, Stethoscope } from "lucide-react-native";
// TTiêu chí để lặp qua và hiển thị thông tin khẩn cấp
export const EMERGENCY_INFO_CRITERIA = [
  "blood_type",
  "allergies",
  "chronic_diseases",
  "medications",
  "emergency_contacts",
];
// Chi tiết hiển thị
export const EMERGENCY_STYLING = {
  blood_type: {
    title: "Nhóm máu",
    icon: Droplet,
    tone: "rose",
  },
  allergies: {
    title: "Tiền sử dị ứng",
    icon: AlertCircle,
    tone: "amber",
  },
  chronic_diseases: {
    title: "Tiền sử bệnh nền",
    icon: Stethoscope,
    tone: "sky",
  },
  medications: {
    title: "Nhóm thuốc đang dùng",
    icon: Pill,
    tone: "teal",
  },
  emergency_contacts: {
    title: "Liên hệ khẩn cấp",
    icon: Contact,
    tone: "orange",
  },
};

// Tông màu cho từng loại thông tin khẩn cấp
export const toneClassMap = {
  rose: {
    bg: "bg-rose-100",
    icon: "#E11D48",
    value: "text-rose-700",
  },
  sky: {
    bg: "bg-sky-100",
    icon: "#0369A1",
    value: "text-sky-700",
  },
  amber: {
    bg: "bg-amber-100",
    icon: "#B45309",
    value: "text-amber-700",
  },
  orange: {
    bg: "bg-orange-100",
    icon: "#C2410C",
    value: "text-orange-700",
  },
  teal: {
    bg: "bg-teal-100",
    icon: "#0F766E",
    value: "text-teal-700",
  },
  slate: {
    bg: "bg-slate-200",
    icon: "#334155",
    value: "text-slate-700",
  },
};

// Mẫu dữ liệu khẩn cấp giả định (sẽ được thay thế bằng dữ liệu thực tế từ API) - tạm thời để phát triển giao diện
export const EMERGENCY_PROFILE = {
  blood_type: "A+",
  allergies: ["Penicillin", "Hải sản", "Phấn hoa", "Lạc", "Đậu nành"],
  chronic_diseases: ["Tăng huyết áp", "Đái tháo đường type 2"],
  medications: ["Hạ áp", "Kháng đông"],
  emergency_contacts: [
    {
      name: "Nguyễn Văn B",
      phone: "0912345678",
      relationship: "Anh trai",
    },
  ],
};
