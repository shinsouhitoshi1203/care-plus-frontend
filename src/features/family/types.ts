export type FamilyRole = "OWNER" | "MEMBER";
export type JoinStatus = "PENDING" | "APPROVED" | "REJECTED";

export interface FamilyItem {
  family_id: string;
  family_name: string;
  family_address: string | null;
  family_role: FamilyRole;
  joined_at: string;
}

export interface FamilyMemberItem {
  member_id?: string;
  id?: string;
  user_id: string | null;
  full_name: string | null;
  email: string | null;
  phone: string | null;
  family_role?: FamilyRole;
  join_status?: JoinStatus;
  date_of_birth?: string | null;
  avatar_url?: string | null;
  joined_at?: string;
}
