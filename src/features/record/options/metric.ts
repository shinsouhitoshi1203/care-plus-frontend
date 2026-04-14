export const healthMetricsVN = ["Huyết áp", "Đường huyết", "Cân nặng", "Nhiệt độ cơ thể"];
export const healthMetrics = ["blood_pressure", "blood_sugar", "weight", "temperature"];
export const healthMetricsUnits = ["mmHg", "mg/dL", "kg", "°C"];
export const healthMetricsOptions = healthMetrics.map((metric, i) => ({
  label: healthMetricsVN[i],
  value: metric,
}));

let healthMetricsMap: Record<string, any> = {};
healthMetrics.forEach((metric, i) => {
  healthMetricsMap[metric] = {
    label: healthMetricsVN[i],
    unit: healthMetricsUnits[i],
  };
});
export { healthMetricsMap };
