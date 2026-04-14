import useZustandStore from "@/stores/zustand";
import { useNavigation } from "expo-router";
import { useEffect } from "react";

export default function useSubPageTitle(title = "") {
  const setSubPageTitle = useZustandStore((state) => state.setSubPageTitle);

  const navigator = useNavigation();
  useEffect(() => {
    navigator.addListener("focus", () => {
      setSubPageTitle(title);
    });
  }, [setSubPageTitle, title, navigator]);
}
