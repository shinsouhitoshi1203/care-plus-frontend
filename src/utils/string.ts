export function convertFromCamelCaseToSnakeCase(str: string): string {
  return str.replace(/([A-Z])/g, "_$1").toLowerCase();
}

export function convertFromSnakeCaseToCamelCase(str: string): string {
  return str.replace(/_([a-z])/g, (match, letter) => letter.toUpperCase());
}
export function convertObjectKeys(
  obj: Record<string, any>,
  type: "camelToSnake" | "snakeToCamel"
): Record<string, any> {
  const newObj: Record<string, any> = {};
  for (const [key, value] of Object.entries(obj)) {
    const convertFunction = type === "camelToSnake" ? convertFromCamelCaseToSnakeCase : convertFromSnakeCaseToCamelCase;
    newObj[convertFunction(key)] = value;
  }
  return newObj;
}
