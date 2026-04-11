import { StyleSheet } from "react-native";

export const styles = StyleSheet.create({
  label: {
    color: "#303E53",
    fontSize: 18,
    fontWeight: "700",
    marginBottom: 10,
  },
  inputWrapper: {
    paddingHorizontal: 0,
    marginBottom: 6,
  },
  inputContainer: {
    minHeight: 56,
    borderBottomWidth: 0,
    borderWidth: 1,
    borderColor: "#E0E8F3",
    borderRadius: 14,
    backgroundColor: "#EEF3F8",
    paddingHorizontal: 14,
  },
  inputText: {
    color: "#2E3B4F",
    fontSize: 18,
    fontWeight: "500",
    overflow: "hidden",
  },
  leftIconContainer: {
    marginRight: 8,
  },
  rightIconContainer: {
    marginLeft: 8,
  },

  linkContainerRight: {
    alignSelf: "flex-end",
    marginTop: 2,
    marginBottom: 22,
  },
  link: {
    color: "#2C5EDB",
    fontSize: 21,
    fontWeight: "700",
  },

  bottomSection: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    marginTop: 28,
    gap: 6,
  },
  bottomHint: {
    color: "#74839A",
    fontSize: 16,
    fontWeight: "500",
  },
  bottomAction: {
    color: "#2C5EDB",
    fontSize: 16,
    fontWeight: "700",
  },
});
