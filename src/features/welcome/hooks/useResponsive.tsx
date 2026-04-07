import { useEffect, useReducer } from "react";
import { useWindowDimensions } from "react-native";

export type ResponsiveProps = Record<string, boolean | number>;
type ActionProps = {
  type: string;
  width: number;
};

export default function useResponsive() {
  const { width } = useWindowDimensions();

  const [state, dispatch] = useReducer(
    (state: ResponsiveProps, action: ActionProps) => {
      const width = action.width;
      switch (action.type) {
        case "SET_RESPONSIVE":
          return {
            showMemberLinkIcon: width >= 390,
            showAuthActionsInOneRow: width >= 430,
          };
        default:
          return state;
      }
    },
    {
      showMemberLinkIcon: false,
      showAuthActionsInOneRow: false,
    }
  );

  useEffect(() => {
    let isDuplicate = false;
    if (!isDuplicate) dispatch({ type: "SET_RESPONSIVE", width });
    return () => {
      isDuplicate = true;
    };
  }, [width]);

  return {
    ...state,
    width,
  };
}
