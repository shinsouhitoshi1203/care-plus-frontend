export function removeNotNumber(str: string) {
  // return str.replace(/[^0-9.]/g, "");
  // Convert to float, remove comma, remove all non-numeric characters except dot and + / -
  return parseFloat(str.replace(/,/g, "").replace(/[^0-9.+\-]/g, "")) || 0;
}
