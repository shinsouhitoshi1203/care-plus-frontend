import secureStore from "@/stores/secureStore";
import { useEffect, useState } from "react";

const tokenDefaultValue = { accessToken: null, refreshToken: null };

type AuthInfoProps = {
  accessToken: string | null;
  refreshToken: string | null;
};

function useAuthInfo() {
  const [token, setToken] = useState<AuthInfoProps>(tokenDefaultValue);
  useEffect(() => {
    let isDoubleFetch = false;
    async function fetchAuthInfo() {
      const accessToken = await secureStore.get("accessToken");
      const refreshToken = await secureStore.get("refreshToken");
      setToken({ accessToken, refreshToken });
    }
    if (isDoubleFetch) return;
    fetchAuthInfo();
    return () => {
      isDoubleFetch = true;
    };
  }, []);
  return token;
}

export default useAuthInfo;
