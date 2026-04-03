function padding(...values: number[]) {
  if (values.length === 1) {
    return {
      padding: values[0],
    };
  }
  if (values.length === 2) {
    return {
      paddingVertical: values[0],
      paddingHorizontal: values[1],
    };
  }
  if (values.length === 3) {
    return {
      paddingTop: values[0],
      paddingHorizontal: values[1],
      paddingBottom: values[2],
    };
  }
  if (values.length === 4) {
    return {
      paddingTop: values[0],
      paddingRight: values[1],
      paddingBottom: values[2],
      paddingLeft: values[3],
    };
  }
  throw new Error("Invalid number of padding values");
}
export default padding;
