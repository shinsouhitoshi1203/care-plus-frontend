import { StyleSheet } from "react-native";

const styles = StyleSheet.create({
  container: {
    borderRadius: 24,

    backgroundColor: "#444c74",
    // elevation: 4,
    minHeight: 220,
    overflow: "hidden",
    paddingBottom: 82,
    paddingHorizontal: 18,
    paddingTop: 18,
  },
  greeting: {
    color: "#fff",
    fontSize: 15,
    fontWeight: "600",
  },
  name: {
    color: "#fff",
    fontSize: 20,
    fontWeight: "800",
    marginTop: 2,
  },
});

export default styles;
