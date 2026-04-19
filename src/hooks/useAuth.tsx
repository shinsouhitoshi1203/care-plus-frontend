import AuthAPI from "@/features/auth/api";
import TokenService from "@/features/auth/token";
import { useQuery } from "@tanstack/react-query";

function useAuth() {
  const { data, isPending } = useQuery({
    queryKey: ["user"],
    queryFn: async () => {
      const { accessToken } = await TokenService.getTokens();

      if (!accessToken) {
        return null;
      }

      // Cả tài khoản thường và Quick Login đều gọi /user/me để lấy profile đầy đủ
      // Backend đã được cập nhật để trả về profile tương thích cho member
      return await AuthAPI.check();
    },
    select: (user) => {
      const checkID = user?.id;
      const checkActive = user?.is_active;

      return {
        isAuthenticated: !!checkID && checkActive,
        user,
        loginType: user?.loginType ?? "full",
      };
    },
    retry: false,
  });

  return {
    isAuthenticated: data?.isAuthenticated,
    user: data?.user,
    loginType: data?.loginType ?? "full",
    isPending,
  };
}

export default useAuth;
