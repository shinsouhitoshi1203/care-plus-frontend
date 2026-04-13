import Loading from "@/components/Loading/LoadingRaw";
import useWait from "@/hooks/useWait";
import { ComponentType } from "react";

function withWaitFallback<P extends object>(Component: ComponentType<P>) {
  return function WithWaitFallback(props: P) {
    const isLoading = useWait();
    return isLoading ? <Loading show /> : <Component {...props} />;
  };
}

export default withWaitFallback;
