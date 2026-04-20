// Emergency Info Types based on API response

export interface EmergencyContact {
  name: string;
  phone: string;
  relationship: string;
}

export interface EmergencyInfo {
  full_name: string;
  blood_type: string | null;
  allergies: string[];
  chronic_diseases: string[];
  emergency_contacts: EmergencyContact[];
  current_medications: string[];
}

export interface EmergencyInfoError {
  status: number;
  message: string;
}
