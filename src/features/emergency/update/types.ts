export const EMERGENCY_SECTION_KEYS = [
  "blood_type",
  "allergies",
  "chronic_diseases",
  "current_medications",
  "emergency_contacts",
] as const;

export type EmergencySectionKey = (typeof EMERGENCY_SECTION_KEYS)[number];

export interface EmergencyContactDraft {
  name: string;
  relationship: string;
  phone: string;
}

export interface EmergencyFormValues {
  sections: EmergencySectionKey[];
  blood_type: string;
  allergies: string[];
  chronic_diseases: string[];
  current_medications: string[];
  emergency_contacts: EmergencyContactDraft[];
}

export interface EmergencyMemberProfile {
  member_id: string;
  full_name: string;
  relation: string;
  age: number;
  highlight: string;
  emergency: Omit<EmergencyFormValues, "sections">;
}

export interface DropdownOption<TValue = string> {
  label: string;
  value: TValue;
}
