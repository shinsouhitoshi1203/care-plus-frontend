import Loading from "@/components/Loading";
import useWait from "@/hooks/useWait";
import { ComponentType } from "react";

function withWaitFallback<P extends object>(Component: ComponentType<P>) {
  return function WithWaitFallback(props: P) {
    const isLoading = useWait();
    return isLoading ? <Loading /> : <Component {...props} />;
  };
}

export default withWaitFallback;
