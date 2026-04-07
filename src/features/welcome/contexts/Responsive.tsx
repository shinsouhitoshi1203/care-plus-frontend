import { createContext } from "react";
import useResponsive from "../hooks/useResponsive";

const ResponsiveContext = createContext({});

export function ResponsiveProvider({ children }: { children: React.ReactNode }) {
  const responsiveData = useResponsive();
  return <ResponsiveContext.Provider value={responsiveData}>{children}</ResponsiveContext.Provider>;
}

export default ResponsiveContext;
