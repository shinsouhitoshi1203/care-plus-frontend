import { Dimensions, Text, View } from "react-native";
import { LineChart } from "react-native-chart-kit";

interface BaseLineChartProps {
  chartDetail: {
    labels: string[];
    values: number[];
  };
  height?: number;

  [key: string]: any;
}

const chartConfig = {
  backgroundColor: "pink",

  backgroundGradientFromOpacity: 0,
  backgroundGradientToOpacity: 0,
  decimalPlaces: 2, // optional, defaults to 2dp
  color: (opacity = 1) => `#ffffff`,
  labelColor: (opacity = 1) => `#ffffff`,
  style: {
    borderRadius: 16,
    paddingTop: 106,
    padding: 0,
  },
  propsForDots: {
    r: "6",
    strokeWidth: "2",
    stroke: "#ffa726",
  },
};

const renderDotLabel = ({ x, y, indexData }: { x: number; y: number; indexData: any }) => {
  return (
    <View
      key={`dot-label-${indexData}-${x}-${y}`}
      style={{
        position: "absolute",
        top: y - 35,
        left: x,
        transform: [{ translateX: "-50%" }],
        backgroundColor: "rgba(255,255,255,0.2)",
        borderRadius: 4,
      }}
      className="px-2 border border-white border-1"
    >
      <Text className="text-sm font-bold text-white">{indexData}</Text>
    </View>
  );
};
export default function BaseLineChart({ chartDetail, height = 200, bg = "transparent", ...rest }: BaseLineChartProps) {
  return (
    <View
      style={{
        display: "flex",
        alignItems: "center",
        backgroundColor: bg,
        paddingTop: 12,
        borderRadius: 16,
        height: height + 24,
      }}
    >
      <LineChart
        data={{
          labels: chartDetail.labels,
          datasets: [
            {
              data: chartDetail.values,
            },
          ],
        }}
        width={Dimensions.get("window").width - 48}
        height={height}
        // Styling
        bezier
        withOuterLines={false}
        chartConfig={{
          ...chartConfig,
        }}
        withHorizontalLines={false}
        withVerticalLines={false}
        withHorizontalLabels={false}
        withVerticalLabels={false}
        segments={chartDetail.values.length - 1}
        renderDotContent={renderDotLabel}
        style={{
          display: "flex",
          paddingVertical: 48,
          borderRadius: 16,
          marginTop: -48,
          alignItems: "center",
        }}
        {...rest}
      />
    </View>
  );
}
