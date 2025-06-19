import { fetchClients } from "@/services/clientsService";
import { useAuthStore } from "@/store/authStore";
import { useClientsStore } from "@/store/clientsStore";
import { normalizeClients } from "@/utils/normalizeClients";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { router, useNavigation } from "expo-router";
import { JSX, useEffect, useState } from "react";
import {
  ActivityIndicator,
  FlatList,
  Pressable,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

function getFirstUnusedLetter(name: string): string {
  const alphabet = "abcdefghijklmnopqrstuvwxyz".split("");
  const used = name.toLowerCase().replace(/[^a-z]/g, "").split("");
  const first = alphabet.find((l) => !used.includes(l));
  return first ? first.toUpperCase() : "-";
}

const ClientsScreen = (): JSX.Element => {
  const navigation = useNavigation();
  const [loading, setLoading] = useState(true);
  const clients = useClientsStore((s) => s.clients);
  const logout = useAuthStore((s) => s.logout);
  const [filter, setFilter] = useState("");

  useEffect(() => {
    navigation.setOptions({
      headerShown: false,
    });
  }, [navigation]);

  useEffect(() => {
    fetchClients().then((data) => {
      const normalized = normalizeClients(data);
      const unique = normalized.filter(
        (n) => !clients.some((c) => c.email === n.email)
      );
      unique.forEach((client) => useClientsStore.getState().addClient(client));
      setLoading(false);
    });
  }, []);

  const filteredClients = clients.filter((client) =>
    client.name.toLowerCase().includes(filter.trim().toLowerCase())
  );

  return (
    <View className="flex-1 bg-[#B6DAF4]">
      <View className="flex-row items-center justify-between px-6 pt-20 pb-3">
        <View className="flex-row items-center">
          <MaterialCommunityIcons
            name="toy-brick"
            size={32}
            color="#4292d8"
            style={{ marginRight: 10 }}
          />
          <Text className="text-2xl font-extrabold text-[#4292d8] tracking-wide">
            TrackToy
          </Text>
        </View>
        <TouchableOpacity
          onPress={() => {
            logout();
            router.replace("/login");
          }}
          className="p-2 rounded-full bg-white/70"
          activeOpacity={0.7}
        >
          <MaterialCommunityIcons name="logout" size={26} color="#4292d8" />
        </TouchableOpacity>
      </View>
      <View className="px-6 mb-2">
        <TextInput
          className="border-2 border-[#62A7E7] bg-white rounded-xl px-4 py-3 text-[#4292d8] mb-2"
          placeholder="Search by name..."
          placeholderTextColor="#62A7E7"
          value={filter}
          onChangeText={setFilter}
        />
      </View>

      <View className="flex-row justify-between px-6 mb-4">
        <TouchableOpacity
          onPress={() => router.push("/client-form")}
          className="bg-[#4292d8] rounded-xl px-4 py-3 flex-1 mr-2 shadow"
          activeOpacity={0.85}
        >
          <Text className="text-white font-bold text-center text-base">
            + Add Client
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => router.push("/statistics")}
          className="bg-[#f59e42] rounded-xl px-4 py-3 flex-1 ml-2 shadow"
          activeOpacity={0.85}
        >
          <Text className="text-white font-bold text-center text-base">
            📊 Statistics
          </Text>
        </TouchableOpacity>
      </View>

      <View className="flex-1 bg-white rounded-t-3xl px-4 pt-4">
        {loading ? (
          <ActivityIndicator size="large" color="#4292d8" style={{ marginTop: 40 }} />
        ) : (
          <FlatList
            data={filteredClients}
            keyExtractor={(item) => item.email}
            renderItem={({ item }) => (
              <Pressable
                onPress={() =>
                  router.push({
                    pathname: "/client-form",
                    params: { email: item.email },
                  })
                }
                className="flex-row items-center p-3 mb-3 bg-[#F3F8FB] rounded-xl shadow-sm"
                style={{ elevation: 2 }}
              >
                <View className="w-12 h-12 rounded-full bg-[#B6DAF4] items-center justify-center mr-4 border-2 border-[#62A7E7]">
                  <MaterialCommunityIcons
                    name="teddy-bear"
                    size={26}
                    color="#4292d8"
                  />
                  <Text className="text-xs font-extrabold text-[#62A7E7]">
                    {getFirstUnusedLetter(item.name)}
                  </Text>
                </View>
                <View>
                  <Text className="font-bold text-base text-[#363B47]">{item.name}</Text>
                  <Text className="text-xs text-[#7B7E8D]">{item.email}</Text>
                </View>
              </Pressable>
            )}
          />
        )}
      </View>
    </View>
  );
};

export default ClientsScreen;
