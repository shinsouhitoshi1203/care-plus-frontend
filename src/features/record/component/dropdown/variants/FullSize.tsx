import { ChevronDown, ChevronUp } from "lucide-react-native";
import React from "react";
import { StyleSheet } from "react-native";
import { Dropdown } from "react-native-element-dropdown";

interface FullSizeDropdownProps {
  data: any[];
  defaultValue?: any;
  placeholderText?: string;
  onChange?: ({ _index, label, value }: any) => void;
  [key: string]: any;
}
const FullSizeDropdownComponent = ({
  data,
  placeholderText,
  defaultValue,
  onChange = (item: any) => {},
  ...rest
}: FullSizeDropdownProps) => {
  return (
    <Dropdown
      style={styles.dropdown}
      placeholderStyle={styles.placeholderStyle}
      selectedTextStyle={styles.selectedTextStyle}
      data={data}
      maxHeight={200}
      labelField="label"
      valueField="value"
      placeholder={placeholderText || "Chọn"}
      renderRightIcon={(v) => (v ? <ChevronUp color={"#000"} /> : <ChevronDown color={"#000"} />)}
      value={defaultValue}
      onChange={(item) => onChange(item)}
      {...rest}
    />
  );
};

export default FullSizeDropdownComponent;

const styles = StyleSheet.create({
  dropdown: {
    height: 50,
    borderColor: "blue",
    borderWidth: 0.5,
    borderRadius: 16,
    paddingHorizontal: 16,
    backgroundColor: "#fff",
    padding: 0,
    minWidth: 100,
  },
  icon: {
    marginRight: 5,
  },
  placeholderStyle: {
    fontSize: 18,
    color: "black",
  },
  selectedTextStyle: {
    fontSize: 18,
    color: "black",
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
