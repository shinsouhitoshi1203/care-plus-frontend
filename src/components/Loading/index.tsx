import useZustandStore from "@/stores/zustand";
import { useEffect, useState } from "react";
import LoadingRaw from "./LoadingRaw";
function useLoadingZustand() {
  const [isLoading, setIsLoading] = useState(false);
  useEffect(() => {
    const unsubscribe = useZustandStore.subscribe(
      (state) => state.loading,
      (loading) => {
        setIsLoading(loading);
      }
    );
    return () => {
      unsubscribe();
    };
  });
  return isLoading;
}
// Loading component using loading state from zustand
function LoadingWithZustand() {
  // return <></>
  const loading = useLoadingZustand();
  return <LoadingRaw variant="dark" show={loading} />;
}
export default LoadingWithZustand;
