import { AccountAPI } from "@/features/account/api";
import { useQuery } from "@tanstack/react-query";

/**
 * Dùng cho nội bộ health record. Đúng ra chỉ có đúng 1 hook nhưng đợi Dũng làm xong thì sẽ gộp lại thành 1 hook duy nhất. Còn hiện tại thì tạm thời chia ra làm 2 hook để dễ quản lý code.
 *
 */

export const defaultSelector = (data: any) => {
  const { family, id } = data || {};
  const ownerFamily = family?.find((f: any) => f.family_role === "OWNER");
  return {
    memberID: id,
    user: { id },
    isOwner: !!ownerFamily,
    familyId: ownerFamily?.family_id ?? family?.[0]?.family_id ?? null,
    // FamilyMember.id của user trong family đầu tiên (dùng cho OWNER selector)
    familyMemberId: ownerFamily?.id ?? family?.[0]?.id ?? null,
    families: [...(family || [])],
  };
};

export const ownerInFamilySelector = (data: { family: any[] }) => {
  const { family } = data || {};
  return {
    isOwner: family.some((f: any) => f.family_role === "OWNER"),
    families: [...family].filter((f: any) => f.family_role === "OWNER"),
  };
};

export default function useFamily(selector = defaultSelector, options = { needPending: false }) {
  const { data, isPending } = useQuery({
    queryKey: ["family.info"],
    queryFn: async () => {
      const user = await AccountAPI.getAccount();
      return {
        id: user.id as string,

        family: user.family as any,
      };
    },
    select: (user) => {
      return selector(user as any);
    },
  });
  if (options?.needPending) {
    return { ...data, isPending };
  }
  return { ...data };
}
