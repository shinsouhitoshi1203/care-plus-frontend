import React from "react";
import { healthMetrics, healthMetricsOptions } from "../../options/metric";
import SmallDropdownComponent from "./variants/Small";

const SelectMetricSmallDropdown = () => {
  return <SmallDropdownComponent defaultValue={healthMetrics[0]} data={healthMetricsOptions} onChange={(item) => {}} />;
};

export default SelectMetricSmallDropdown;
