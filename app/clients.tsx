import { router } from "expo-router";
import { useEffect, useState } from "react";
import { ActivityIndicator, Button, FlatList, Text, View } from "react-native";
import { fetchClients } from "../src/services/clientsService";
import { normalizeClients } from "../src/utils/normalizeClients";

function getFirstUnusedLetter(name: string): string {
  const alphabet = "abcdefghijklmnopqrstuvwxyz".split("");
  const used = name.toLowerCase().replace(/[^a-z]/g, "").split("");
  const first = alphabet.find((l) => !used.includes(l));
  return first ? first.toUpperCase() : "-";
}

export default function ClientsScreen() {
  const [clients, setClients] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchClients().then((data) => {
      setClients(normalizeClients(data));
      setLoading(false);
    });
  }, []);

  return (
 <View className="flex-1 bg-white p-4">
    <Text className="text-2xl font-bold mb-3">Clients</Text>
    <Button title="Add Client" onPress={() => router.push("/client-form")} />
    {loading ? (
      <ActivityIndicator size="large" style={{ marginTop: 20 }} />
    ) : (
      <FlatList
        data={clients}
        keyExtractor={(item) => item.email}
        renderItem={({ item }) => (
          <View className="flex-row items-center p-3 my-2 border rounded-lg">
            <View className="w-10 h-10 rounded-full bg-blue-200 items-center justify-center mr-4">
              <Text className="font-bold text-lg">
                {getFirstUnusedLetter(item.name)}
              </Text>
            </View>
            <View>
              <Text className="font-semibold">{item.name}</Text>
              <Text className="text-xs text-gray-500">{item.email}</Text>
            </View>
          </View>
        )}
      />
    )}
  </View>
  );
}
