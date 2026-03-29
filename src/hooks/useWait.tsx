import { useNavigation } from "expo-router";
import { useEffect, useState } from "react";

function useWait() {
  const [isLoading, setIsLoading] = useState(true);

  const navigation = useNavigation();
  useEffect(() => {
    const unsubscribe = navigation.addListener("transitionEnd" as any, () => {
      setIsLoading(false);
    });
    return unsubscribe;
  }, [navigation]);

  return isLoading;
}

export default useWait;
