import { ChevronDown, ChevronUp } from "lucide-react-native";
import React from "react";
import { StyleSheet } from "react-native";
import { Dropdown } from "react-native-element-dropdown";
import { healthMetrics, healthMetricsOptions } from "../../options/metric";

const DropdownComponent = () => {
  return (
    <Dropdown
      style={styles.dropdown}
      placeholderStyle={styles.placeholderStyle}
      selectedTextStyle={styles.selectedTextStyle}
      data={healthMetricsOptions}
      maxHeight={200}
      labelField="label"
      valueField="value"
      placeholder={"Chọn chỉ số sức khỏe"}
      renderRightIcon={(v) => (v ? <ChevronUp color={"#fff"} /> : <ChevronDown color={"#fff"} />)}
      value={healthMetrics[0]}
      onChange={(item) => {}}
    />
  );
};

export default DropdownComponent;

const styles = StyleSheet.create({
  dropdown: {
    // height: 50,
    borderColor: "#ffffffff",
    borderWidth: 0.5,
    borderRadius: 16,
    paddingHorizontal: 8,
    paddingVertical: 0,
    padding: 0,
    minWidth: 200,
  },
  icon: {
    marginRight: 5,
  },
  label: {
    position: "absolute",
    backgroundColor: "white",
    left: 22,
    top: 8,
    zIndex: 999,
    paddingHorizontal: 8,
    fontSize: 14,
  },
  placeholderStyle: {
    fontSize: 16,
    color: "white",
  },
  selectedTextStyle: {
    fontSize: 16,
    color: "white",
  },
  iconStyle: {
    width: 20,
    height: 20,
  },
  inputSearchStyle: {
    height: 40,
    fontSize: 16,
  },
});
