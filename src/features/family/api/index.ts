import apiClient from "@/config/axios";
import { FamilyItem, FamilyMemberItem, JoinStatus } from "../types";

const FamilyAPI = {
  async getFamilies(): Promise<FamilyItem[]> {
    const response = await apiClient.get("/family");
    return response.data?.data?.families ?? [];
  },

  async createFamily(payload: { name: string; address?: string }) {
    const response = await apiClient.post("/family", payload);
    return response.data?.data?.family;
  },

  async joinByInviteCode(payload: { inviteCode: string }) {
    const response = await apiClient.post("/family/join", payload);
    return response.data?.data;
  },

  async generateInvite(familyId: string): Promise<{ inviteCode: string; expiresIn: number }> {
    const response = await apiClient.post(`/family/${familyId}/generate-invite`);
    return response.data?.data;
  },

  async getMembers(familyId: string): Promise<FamilyMemberItem[]> {
    const response = await apiClient.get(`/family/${familyId}/members`);
    return response.data?.data?.members ?? [];
  },

  async getPendingMembers(familyId: string): Promise<FamilyMemberItem[]> {
    const response = await apiClient.get(`/family/${familyId}/pending-members`);
    return response.data?.data?.members ?? [];
  },

  async reviewJoinRequest(payload: { familyId: string; memberId: string; status: JoinStatus }) {
    const { familyId, memberId, status } = payload;
    const response = await apiClient.patch(`/family/${familyId}/members/${memberId}/status`, { status });
    return response.data?.data;
  },
};

export default FamilyAPI;
