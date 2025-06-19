import { useEffect, useState } from "react";
import { Dimensions, ScrollView, Text, View } from "react-native";
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
  const [chart, setChart] = useState<{ labels: string[]; data: number[] }>({
    labels: [],
    data: [],
  });
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
        <Text>Loading statistics...</Text>
      </View>
    );
  }

  return (
    <ScrollView className="flex-1 bg-white p-4">
      <Text className="text-2xl font-bold mb-6">Sales Statistics</Text>
      {chart.labels.length > 0 ? (
        <LineChart
          data={{
            labels: chart.labels,
            datasets: [{ data: chart.data }],
          }}
          width={Dimensions.get("window").width - 32}
          height={220}
          yAxisSuffix="R$"
          chartConfig={{
            backgroundGradientFrom: "#fff",
            backgroundGradientTo: "#fff",
            decimalPlaces: 0,
            color: (opacity = 1) => `rgba(60, 130, 246, ${opacity})`,
            labelColor: (opacity = 1) => `rgba(0,0,0,${opacity})`,
            style: { borderRadius: 16 },
            propsForDots: { r: "4" },
          }}
          bezier
          style={{ borderRadius: 16, marginBottom: 20 }}
        />
      ) : (
        <Text>No sales data to show.</Text>
      )}

      {tops && (
        <View className="mt-4">
          <Text className="text-lg font-semibold mb-2">Highlights</Text>
          <View className="mb-2">
            <Text>
              <Text className="font-bold">Top Volume: </Text>
              {tops.topVolume.name} ({tops.topVolume.total})
            </Text>
          </View>
          <View className="mb-2">
            <Text>
              <Text className="font-bold">Top Avg Sale: </Text>
              {tops.topAvg.name} ({tops.topAvg.avg.toFixed(2)})
            </Text>
          </View>
          <View className="mb-2">
            <Text>
              <Text className="font-bold">Top Frequency: </Text>
              {tops.topFreq.name} ({tops.topFreq.freq})
            </Text>
          </View>
        </View>
      )}
    </ScrollView>
  );
}
