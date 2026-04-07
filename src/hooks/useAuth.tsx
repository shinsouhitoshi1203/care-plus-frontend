import checkAuth from "@/features/auth/api/checkAuth";
import useAuthInfo from "@/features/auth/hook/useAuthInfo";
import { useEffect, useState } from "react";

function useAuth() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const authInfo = useAuthInfo();

  useEffect(() => {
    // Check authentication status on component mount
    let isDoubleFetch = false;

    const checkAuthStatus = async () => {
      const authStatus = await checkAuth();
      setIsAuthenticated(authStatus);
    };
    if (isDoubleFetch) return;
    // Code starts here
    if (!authInfo.accessToken) checkAuthStatus();

    // Code ends here
    return () => {
      isDoubleFetch = true;
    };
  }, [isAuthenticated, authInfo]);

  return isAuthenticated;
}

export default useAuth;
