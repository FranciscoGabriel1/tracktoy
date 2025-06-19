import { useEffect, useState } from "react";
import { ActivityIndicator, Dimensions, ScrollView, Text, View } from "react-native";
import { LineChart } from "react-native-chart-kit";
import { fetchClients } from "../src/services/clientsService";
import { normalizeClients } from "../src/utils/normalizeClients";

type Sale = { data: string; valor: number };
type Client = {
  name: string;
  email: string;
  birth: string;
  sales: Sale[];
};

function getSalesPerDay(clients: Client[]) {
  const dayTotals: Record<string, number> = {};
  clients.forEach(client => {
    client.sales.forEach(sale => {
      dayTotals[sale.data] = (dayTotals[sale.data] || 0) + sale.valor;
    });
  });
  const days = Object.keys(dayTotals).sort();
  return {
    labels: days,
    data: days.map(day => dayTotals[day]),
  };
}

function getTopClients(clients: Client[]) {
  let topVolume = { name: "-", total: 0 };
  let topAvg = { name: "-", avg: 0 };
  let topFreq = { name: "-", freq: 0 };

  clients.forEach(client => {
    const total = client.sales.reduce((sum, s) => sum + s.valor, 0);
    const avg = client.sales.length ? total / client.sales.length : 0;
    const freq = new Set(client.sales.map(s => s.data)).size;
    if (total > topVolume.total) topVolume = { name: client.name, total };
    if (avg > topAvg.avg) topAvg = { name: client.name, avg };
    if (freq > topFreq.freq) topFreq = { name: client.name, freq };
  });

  return { topVolume, topAvg, topFreq };
}

export default function StatisticsScreen() {
  const [clients, setClients] = useState<Client[]>([]);
  const [loading, setLoading] = useState(true);
  const [chart, setChart] = useState<{ labels: string[]; data: number[] }>({ labels: [], data: [] });
  const [tops, setTops] = useState<any>(null);

  useEffect(() => {
    fetchClients().then((data) => {
      const normalized = normalizeClients(data);
      setClients(normalized);
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
      <Text className="text-2xl font-extrabold mb-3 text-[#4292d8] tracking-wide text-center">📊 Sales Statistics</Text>

      <View className="bg-[#e8f2fc] rounded-2xl p-4 shadow mb-7">
        {chart.labels.length > 0 ? (
          <LineChart
            data={{
              labels: chart.labels,
              datasets: [{ data: chart.data }],
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

      {/* Destaques bonitos */}
      {tops && (
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
      )}
    </ScrollView>
  );
}
