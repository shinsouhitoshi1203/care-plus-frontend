import apiClient from "@/config/axios";

export interface PrescriptionExtracted {
  name: string;
  dosage?: string;
  frequency?: string;
  bin?: string;
  days?: number;
}

export interface PrescriptionScanResponse {
  status: string;
  data: {
    extracted: PrescriptionExtracted[];
    confidence: number;
    raw_text?: string;
  };
}

export interface MedicationItemPayload {
  name: string;
  dosage?: string;
  frequency?: string;
  bin?: string;
  times?: string[];
  days?: number;
}

export interface MedicationSchedulePayload {
  start_date: string; // ISO String
  end_date?: string; // ISO String
  session_times?: string[];
  medications: MedicationItemPayload[];
}

export interface MedicationScheduleResponse {
  _id: string;
  family_id: string;
  family_member_id: string;
  medications: MedicationItemPayload[];
  start_date: string;
  end_date: string;
  reminder_message: string;
  is_active: boolean;
  session_times: string[];
  created_at: string;
}

class CMedicationAPI {
  async scanPrescription(imageUri: string, mimeType: string = 'image/jpeg', fileName: string = 'scan.jpg'): Promise<PrescriptionScanResponse> {
    const formData = new FormData();
    formData.append("image", {
      uri: imageUri,
      name: fileName,
      type: mimeType,
    } as any);

    try {
      const response = await apiClient.post("/ai/scan-prescription", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      return response.data;
    } catch (error) {
      console.log(" !!! Error scanning prescription:", error);
      throw error;
    }
  }

  async createSchedule(familyId: string, memberId: string, payload: MedicationSchedulePayload): Promise<{ scheduleId: string, reminderMessage: string }> {
    const response = await apiClient.post(`/family/${familyId}/members/${memberId}/medications`, payload);
    return response.data?.data;
  }

  async getSchedules(familyId: string, memberId: string): Promise<MedicationScheduleResponse[]> {
    const response = await apiClient.get(`/family/${familyId}/members/${memberId}/medications`);
    return response.data?.data?.schedules || [];
  }
}

export const MedicationAPI = new CMedicationAPI();
