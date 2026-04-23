import {
  type DropdownOption,
  type EmergencyContactDraft,
  type EmergencyFormValues,
  type EmergencyMemberProfile,
  type EmergencySectionKey,
} from "./types";

export const BLOOD_TYPE_OPTIONS: DropdownOption<string>[] = [
  { label: "A+", value: "A+" },
  { label: "A-", value: "A-" },
  { label: "B+", value: "B+" },
  { label: "B-", value: "B-" },
  { label: "AB+", value: "AB+" },
  { label: "AB-", value: "AB-" },
  { label: "O+", value: "O+" },
  { label: "O-", value: "O-" },
];

export const EMERGENCY_SECTION_OPTIONS: DropdownOption<EmergencySectionKey>[] = [
  { label: "Nhóm máu", value: "blood_type" },
  { label: "Dị ứng", value: "allergies" },
  { label: "Bệnh mãn tính", value: "chronic_diseases" },
  { label: "Thuốc đang sử dụng", value: "current_medications" },
  { label: "Liên hệ khẩn cấp", value: "emergency_contacts" },
];

export const ALLERGY_SUGGESTIONS = ["Penicillin", "Hải sản", "Đậu phộng", "Phấn hoa", "Lactose"];
export const CHRONIC_SUGGESTIONS = ["Tăng huyết áp", "Tiểu đường type 2", "Hen suyễn", "Tim mạch"];
export const MEDICATION_SUGGESTIONS = ["Metformin", "Amlodipine", "Losartan", "Insulin"];

export const EMPTY_CONTACT: EmergencyContactDraft = {
  name: "",
  relationship: "",
  phone: "",
};

export const EMPTY_EMERGENCY_DRAFT: EmergencyFormValues = {
  sections: ["blood_type", "emergency_contacts"],
  blood_type: "",
  allergies: [],
  chronic_diseases: [],
  current_medications: [],
  emergency_contacts: [{ ...EMPTY_CONTACT }],
};

export const EMERGENCY_MEMBER_MOCKS: EmergencyMemberProfile[] = [
  {
    member_id: "member-grandma",
    full_name: "Bà Nguyễn Thị Lan",
    relation: "Bà nội",
    age: 72,
    highlight: "#FB7185",
    emergency: {
      blood_type: "A+",
      allergies: ["Penicillin", "Hải sản"],
      chronic_diseases: ["Tăng huyết áp", "Đái tháo đường type 2"],
      current_medications: ["Amlodipine", "Metformin"],
      emergency_contacts: [
        { name: "Nguyễn Văn Minh", relationship: "Con trai", phone: "0901234567" },
        { name: "Nguyễn Thị Hạnh", relationship: "Con dâu", phone: "0912345678" },
      ],
    },
  },
  {
    member_id: "member-father",
    full_name: "Ông Nguyễn Văn Hùng",
    relation: "Bố",
    age: 48,
    highlight: "#38BDF8",
    emergency: {
      blood_type: "O+",
      allergies: ["Phấn hoa"],
      chronic_diseases: ["Hen suyễn"],
      current_medications: ["Salbutamol"],
      emergency_contacts: [{ name: "Nguyễn Văn Tuấn", relationship: "Con trai", phone: "0988111222" }],
    },
  },
  {
    member_id: "member-younger-sister",
    full_name: "Nguyễn Thu Trang",
    relation: "Em gái",
    age: 17,
    highlight: "#22C55E",
    emergency: {
      blood_type: "B+",
      allergies: ["Đậu phộng"],
      chronic_diseases: [],
      current_medications: [],
      emergency_contacts: [{ name: "Nguyễn Văn Hùng", relationship: "Bố", phone: "0909988776" }],
    },
  },
];

export const EMERGENCY_MEMBER_OPTIONS: DropdownOption<string>[] = EMERGENCY_MEMBER_MOCKS.map((member) => ({
  label: member.full_name,
  value: member.member_id,
}));

function inferSectionsFromDraft(draft: Omit<EmergencyFormValues, "sections">): EmergencySectionKey[] {
  const next: EmergencySectionKey[] = [];
  if (draft.blood_type.trim()) next.push("blood_type");
  if (draft.allergies.length > 0) next.push("allergies");
  if (draft.chronic_diseases.length > 0) next.push("chronic_diseases");
  if (draft.current_medications.length > 0) next.push("current_medications");
  if (draft.emergency_contacts.length > 0) next.push("emergency_contacts");

  if (next.length === 0) {
    return ["blood_type", "emergency_contacts"];
  }

  return next;
}

export function createEmergencyDraft(draft: Omit<EmergencyFormValues, "sections">): EmergencyFormValues {
  return {
    sections: inferSectionsFromDraft(draft),
    blood_type: draft.blood_type,
    allergies: [...draft.allergies],
    chronic_diseases: [...draft.chronic_diseases],
    current_medications: [...draft.current_medications],
    emergency_contacts: draft.emergency_contacts.map((contact) => ({ ...contact })),
  };
}

export function cloneEmergencyDraft(draft: EmergencyFormValues): EmergencyFormValues {
  return {
    sections: [...draft.sections],
    blood_type: draft.blood_type,
    allergies: [...draft.allergies],
    chronic_diseases: [...draft.chronic_diseases],
    current_medications: [...draft.current_medications],
    emergency_contacts: draft.emergency_contacts.map((contact) => ({ ...contact })),
  };
}

export function buildInitialEmergencyDrafts(): Record<string, EmergencyFormValues> {
  return EMERGENCY_MEMBER_MOCKS.reduce<Record<string, EmergencyFormValues>>((acc, member) => {
    acc[member.member_id] = createEmergencyDraft(member.emergency);
    return acc;
  }, {});
}
