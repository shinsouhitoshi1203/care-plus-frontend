import { StyleSheet } from "react-native";

export const styles = StyleSheet.create({
  fullButton: {
    width: "100%",
    display: "flex",
    gap: 20,
    minHeight: 58,
    borderRadius: 13,
    // borderWidth: 2,
  },
  fullButtonTitle: {
    fontSize: 22,
    fontWeight: "700" as const,
    // color: "#FFFFFF",
  },
  fullButtonIcon: {
    marginLeft: 10,
  },
});
