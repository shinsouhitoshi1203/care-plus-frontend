import useZustandStore from "@/stores/zustand";
import { useNavigation } from "expo-router";
import { useEffect } from "react";

export default function useSubPageTitle(title = "", outerNavigator?: any) {
  const setSubPageTitle = useZustandStore((state) => state.setSubPageTitle);

  const navigator = useNavigation();
  useEffect(() => {
    if (outerNavigator) {
      outerNavigator.addListener("focus", () => {
        setSubPageTitle(title);
      });
      return () => {
        outerNavigator.removeListener("focus", () => {
          setSubPageTitle(title);
        });
      };
    } else {
      navigator.addListener("focus", () => {
        setSubPageTitle(title);
      });
      return () => {
        navigator.removeListener("focus", () => {
          setSubPageTitle(title);
        });
      };
    }
  }, [setSubPageTitle, title, navigator, outerNavigator]);
}
