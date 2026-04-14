import useZustandStore from "@/stores/zustand";
import { useEffect } from "react";

export default function useSubPageTitle(title = "") {
  const setSubPageTitle = useZustandStore((state) => state.setSubPageTitle);
  useEffect(() => {
    setSubPageTitle(title);
  }, [setSubPageTitle, title]);
}
