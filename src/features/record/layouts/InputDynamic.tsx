import { useFormContext } from "react-hook-form";
import BloodPressureField from "../component/inputs/BloodPressure";
import BloodSugarField from "../component/inputs/BloodSugar";
import WeightField from "../component/inputs/Weight";

export default function InputDynamicLayout() {
  const { watch } = useFormContext();
  const watchType = watch("type");

  if (watchType === "weight") {
    return <WeightField />;
  } else if (watchType === "blood_pressure") {
    return <BloodPressureField />;
  } else if (watchType === "blood_sugar") {
    return <BloodSugarField />;
  }
}
