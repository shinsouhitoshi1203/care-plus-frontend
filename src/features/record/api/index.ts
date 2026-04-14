import apiClient from "@/config/axios";

export interface HealthRecordProps {
  memberID: string;
  familyID: string;
  // records
  type: string;
  value: Record<string, number>;
  unit: string;
  note?: string;
  recorded_at?: any;

  // for update
  recordID?: string;
}

const sampleRecordRequested = {
  status: "success",
  data: {
    record: {
      family_member_id: "b27dd5b7-a0e6-4d90-9b21-595af766f005",
      family_id: "ec833f94-21eb-42e8-b510-84a325b2fe53",
      updated_by_user_id: "b27dd5b7-a0e6-4d90-9b21-595af766f005",
      type: "blood_pressure",
      value: {
        systolic: 120,
        diastolic: 80,
      },
      unit: "mmHg",
      note: "Đo sau khi ăn",
      recorded_at: "2026-04-14T08:38:35.308Z",
      _id: "69de01593d179d1bffebdbed",
      created_at: "2026-04-14T08:56:58.024Z",
      updated_at: "2026-04-14T08:56:58.024Z",
      __v: 0,
    },
  },
};

const sampleRecordResponse = {
  status: "success",
  data: {
    records: [
      {
        _id: "69de01593d179d1bffebdbed",
        family_member_id: "b27dd5b7-a0e6-4d90-9b21-595af766f005",
        family_id: "ec833f94-21eb-42e8-b510-84a325b2fe53",
        updated_by_user_id: "b27dd5b7-a0e6-4d90-9b21-595af766f005",
        type: "blood_pressure",
        value: {
          systolic: 120,
          diastolic: 80,
        },
        unit: "mmHg",
        note: "Đo sau khi ăn",
        recorded_at: "2026-04-14T08:38:35.308Z",
        created_at: "2026-04-14T08:56:58.024Z",
        updated_at: "2026-04-14T08:56:58.024Z",
        __v: 0,
      },
    ],
  },
};

class CRecordAPI {
  /**
   * Makes the base URL for RecordAPI endpoints
   * @param { memberID, familyID }
   * @returns `/api/family/{familyId}/members/{memberId}/health`
   */

  private makeBaseURL({ memberID, familyID }: Pick<HealthRecordProps, "memberID" | "familyID">) {
    if (!memberID || !familyID)
      throw new Error("memberID and familyID are required to construct the base URL for RecordAPI");
    return `/family/${familyID}/members/${memberID}/health`;
  }

  constructor({ dev }: { dev: boolean }) {
    if (dev) {
      console.log("RecordAPI initialized in development mode");
    }
  }

  async createHealthRecord({ memberID, familyID, ...rest }: HealthRecordProps) {
    try {
      const response = await apiClient.post(`${this.makeBaseURL({ memberID, familyID })}`, {
        ...rest,
      });
      return response.data;
    } catch (error) {
      console.error("Error creating health record:", error);
      throw error;
    }
  }

  async getHealthRecords({ memberID, familyID, type, recorded_at }: Record<string, string>) {
    try {
      const response = await apiClient.get(`${this.makeBaseURL({ memberID, familyID })}`, {
        params: {
          type,
          date: recorded_at,
        },
      });
      console.log("Fetched health records:", response.data);
      return response.data.data.records;
    } catch (error) {
      console.error("Error fetching health records:", error);
      throw error;
    }
  }

  async updateHealthRecord({
    memberID,
    familyID,
    recordID,
    ...rest
  }: Omit<HealthRecordProps, "recorded_at" | "type" | "unit">) {
    try {
      const response = await apiClient.patch(`${this.makeBaseURL({ memberID, familyID })}/${recordID}`, {
        ...rest,
      });
      return response.data;
    } catch (error) {
      console.error("Error updating health record:", error);
      throw error;
    }
  }

  async deleteHealthRecord({
    memberID,
    familyID,
    recordID,
  }: Pick<HealthRecordProps, "memberID" | "familyID" | "recordID">) {
    try {
      const response = await apiClient.delete(`${this.makeBaseURL({ memberID, familyID })}/${recordID}`);
      return response.data;
    } catch (error) {
      console.error("Error deleting health record:", error);
      throw error;
    }
  }
}

export const RecordAPI = new CRecordAPI({
  dev: true,
});
