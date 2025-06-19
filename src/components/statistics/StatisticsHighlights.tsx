import { JSX } from "react";
import { Text, View } from "react-native";

interface HighlightsProps {
  tops: {
    topVolume: { name: string; total: number };
    topAvg: { name: string; avg: number };
    topFreq: { name: string; freq: number };
  };
}

export const StatisticsHighlights = ({ tops }: HighlightsProps): JSX.Element => (
  <View className="bg-white rounded-2xl p-4 shadow-lg mb-4">
    <Text className="text-xl font-bold text-[#4292d8] mb-3">🏅 Highlights</Text>
    <View className="flex-row items-center mb-2">
      <Text className="text-base font-semibold text-[#363B47] mr-2">🥇 Top Volume:</Text>
      <Text className="text-base text-[#f59e42] font-bold">{tops.topVolume.name}</Text>
      <Text className="text-base text-[#7B7E8D] ml-2">({tops.topVolume.total})</Text>
    </View>
    <View className="flex-row items-center mb-2">
      <Text className="text-base font-semibold text-[#363B47] mr-2">💸 Top Avg Sale:</Text>
      <Text className="text-base text-[#4292d8] font-bold">{tops.topAvg.name}</Text>
      <Text className="text-base text-[#7B7E8D] ml-2">({tops.topAvg.avg.toFixed(2)})</Text>
    </View>
    <View className="flex-row items-center">
      <Text className="text-base font-semibold text-[#363B47] mr-2">🔄 Top Frequency:</Text>
      <Text className="text-base text-[#B6DAF4] font-bold">{tops.topFreq.name}</Text>
      <Text className="text-base text-[#7B7E8D] ml-2">({tops.topFreq.freq})</Text>
    </View>
  </View>
);
