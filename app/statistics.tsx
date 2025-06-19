import { StatisticsChart } from "@/components/statistics/StatisticsChart";
import { StatisticsHighlights } from "@/components/statistics/StatisticsHighlights";
import { fetchClients } from "@/services/clientsService";
import { normalizeClients } from "@/utils/normalizeClients";
import { getSalesPerDay, getTopClients } from "@/utils/statistics";
import { JSX, useEffect, useState } from "react";
import { ActivityIndicator, ScrollView, Text, View } from "react-native";

const StatisticsScreen = (): JSX.Element => {
  const [loading, setLoading] = useState(true);
  const [chart, setChart] = useState<{ labels: string[]; data: number[] }>({ labels: [], data: [] });
  const [tops, setTops] = useState<any>(null);

  useEffect(() => {
    fetchClients().then((data) => {
      const normalized = normalizeClients(data);
      setChart(getSalesPerDay(normalized));
      setTops(getTopClients(normalized));
      setLoading(false);
    });
  }, []);

  if (loading) {
    return (
      <View className="flex-1 items-center justify-center bg-white">
        <ActivityIndicator size="large" color="#4292d8" />
        <Text className="mt-4 text-lg font-semibold text-[#4292d8]">Loading statistics...</Text>
      </View>
    );
  }

  return (
    <ScrollView className="flex-1 bg-white p-4">
      <Text className="text-2xl font-extrabold mb-3 text-[#4292d8] tracking-wide text-center">
        📊 Sales Statistics
      </Text>
      <StatisticsChart labels={chart.labels} data={chart.data} />
      {tops && <StatisticsHighlights tops={tops} />}
    </ScrollView>
  );
};

export default StatisticsScreen;
