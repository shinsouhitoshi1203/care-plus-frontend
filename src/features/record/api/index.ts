import apiClient from "@/config/axios";
import secureStore from "@/stores/secureStore";

export interface HealthRecordProps {
  memberID: string;
  familyID?: string;
  // records
  type: string;
  value: Record<string, number>;
  unit: string;
  note?: string;
  recorded_at?: any;

  // for update
  recordID?: string;
}

/* const sampleRecordRequested = {
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
}; */

class CRecordAPI {
  /**
   * Makes the base URL for RecordAPI endpoints
   * @param { memberID }
   * @returns `/api/family/members/{memberId}/health`
   */

  private makeBaseURL({ memberID }: Pick<HealthRecordProps, "memberID">) {
    if (!memberID) throw new Error("Không có thông tin của thành viên");
    return `/family/members/${memberID}/health`;
  }

  constructor({ dev }: { dev: boolean }) {
    if (dev) {
      console.log("RecordAPI initialized in development mode");
    }
  }

  async createHealthRecord({ memberID, ...rest }: HealthRecordProps) {
    try {
      const response = await apiClient.post(`${this.makeBaseURL({ memberID })}`, {
        ...rest,
      });
      return response.data;
    } catch (error) {
      console.log(" !!! Error creating health record:", error);
      throw error;
    }
  }

  async getHealthRecords({
    memberID,
    type,
    recorded_at,
  }: Pick<HealthRecordProps, "memberID"> & Partial<Pick<HealthRecordProps, "type" | "recorded_at">>) {
    try {
      const response = await apiClient.get(`${this.makeBaseURL({ memberID })}`, {
        params: {
          type,
          date: recorded_at,
        },
      });
      return response.data.data.records;
    } catch (error) {
      console.log(" !!! Error fetching health records:", error);
      throw error;
    }
  }

  async getHealthRecordFromLocal(localRecordID: string) {
    // Get health record from local storage, used for edit page to get the record data before update
    try {
      const localTarget = await secureStore.get(`health-records.edit-target`);
      if (!localRecordID || !localTarget) {
        throw new Error("No record found in local storage for ID: " + localRecordID);
      }
      const record = JSON.parse(localTarget);
      return record;
    } catch (error) {
      console.log(" !!! Error fetching health record from local storage:", error);
      throw error;
    }
  }

  async saveEditTargetToLocal(data: Omit<HealthRecordProps, "familyID" | "recorded_at" | "type" | "unit">) {
    try {
      await secureStore.set(`health-records.edit-target`, JSON.stringify(data));
    } catch (error) {
      console.log(" !!! Error saving health record to local storage:", error);
      throw error;
    }
  }

  async updateHealthRecord(
    recordID: string,
    { memberID, ...rest }: Omit<HealthRecordProps, "recorded_at" | "type" | "unit">
  ) {
    try {
      console.log(recordID, memberID);

      const response = await apiClient.patch(`${this.makeBaseURL({ memberID })}/${recordID}`, {
        ...rest,
      });
      return response.data;
    } catch (error) {
      console.log(" !!! Error updating health record:", error);
      throw error;
    }
  }

  async deleteHealthRecord({ memberID, recordID }: Pick<HealthRecordProps, "memberID" | "recordID">) {
    try {
      const response = await apiClient.delete(`${this.makeBaseURL({ memberID })}/${recordID}`);
      return response.data;
    } catch (error) {
      console.log(" !!! Error deleting health record:", error);
      throw error;
    }
  }
}

export const RecordAPI = new CRecordAPI({
  dev: true,
});
