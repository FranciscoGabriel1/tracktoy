import { JSX } from "react";
import { Dimensions, Text, View } from "react-native";
import { LineChart } from "react-native-chart-kit";

interface StatisticsChartProps {
  labels: string[];
  data: number[];
}

export const StatisticsChart = ({ labels, data }: StatisticsChartProps): JSX.Element => (
  <View className="bg-[#e8f2fc] rounded-2xl p-4 shadow mb-7">
    {labels.length > 0 ? (
      <LineChart
        data={{
          labels,
          datasets: [{ data }],
        }}
        width={Dimensions.get("window").width - 48}
        height={230}
        yAxisSuffix=" R$"
        chartConfig={{
          backgroundGradientFrom: "#e8f2fc",
          backgroundGradientTo: "#e8f2fc",
          decimalPlaces: 0,
          color: (opacity = 1) => `rgba(66, 146, 216, ${opacity})`,
          labelColor: (opacity = 1) => `rgba(80, 80, 80, ${opacity})`,
          style: { borderRadius: 18 },
          propsForDots: { r: "5", strokeWidth: "3", stroke: "#f59e42" },
          propsForBackgroundLines: { stroke: "#d0e6fb" },
        }}
        bezier
        style={{ borderRadius: 18 }}
      />
    ) : (
      <Text className="text-center text-gray-500 font-medium">No sales data to show.</Text>
    )}
  </View>
);
