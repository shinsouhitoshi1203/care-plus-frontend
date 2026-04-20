import { useQuery } from "@tanstack/react-query";
import { AccountAPI, AccountProps } from "./api";
export default function useAccount(selector: (state: AccountProps) => any = (x) => x.user, timeout = 1000 * 60 * 5) {
  const { data: _, isPending } = useQuery<AccountProps>({
    queryKey: ["user"],
    queryFn: async () => {
      console.log(await AccountAPI.getAccount());

      return await AccountAPI.getAccount();
    },
    select: selector,
    retry: false,
    // staleTime: timeout,
  });

  return {
    data: _,
    isPending,
  };
}
