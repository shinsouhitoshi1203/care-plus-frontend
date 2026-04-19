import useAuth from "@/hooks/useAuth";

export default function useAccount() {
  const { user } = useAuth();
  const isQuickLogin = user?.isQuickLogin ?? false;

  return {
    user,
    isQuickLogin,
  };
}
