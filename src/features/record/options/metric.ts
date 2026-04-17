export const healthMetricsVN = ["Huyết áp", "Đường huyết", "Cân nặng", "Nhiệt độ cơ thể"];
export const healthMetrics = ["blood_pressure", "blood_sugar", "weight", "temperature"];
export const healthMetricsUnits = ["mmHg", "mg/dL", "kg", "°C"];
export const healthMetricsInputNames = [
  ["_blood_pressure_systolic", "_blood_pressure_diastolic"],
  "_blood_sugar",
  "_weight",
  "_temperature",
];
export const healthMetricsOptions = healthMetrics.map((metric, i) => ({
  label: healthMetricsVN[i],
  value: metric,
}));

let healthMetricsMap: Record<string, any> = {};
healthMetrics.forEach((metric, i) => {
  healthMetricsMap[metric] = {
    label: healthMetricsVN[i],
    unit: healthMetricsUnits[i],
    inputName: healthMetricsInputNames[i],
    defaultInput: "",
  };
});

// for reset form value when metric type changes
let healthMetricsMapDefault: Record<string, any> = {};
healthMetricsInputNames.forEach((metric, i) => {
  if (Array.isArray(metric)) {
    metric.forEach((m) => {
      healthMetricsMapDefault[m] = "";
    });
  } else {
    healthMetricsMapDefault[metric] = "";
  }
});

export { healthMetricsMap, healthMetricsMapDefault };
