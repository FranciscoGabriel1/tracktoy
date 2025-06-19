import { MaterialCommunityIcons } from "@expo/vector-icons";
import { zodResolver } from "@hookform/resolvers/zod";
import DateTimePicker from "@react-native-community/datetimepicker";
import { router, useLocalSearchParams } from "expo-router";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import {
  Alert,
  Platform,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { useClientsStore } from "../src/store/clientsStore";
import { ClientForm, clientSchema } from "../src/types/client";

export const options = {
  headerShown: false,
};

export default function ClientFormScreen() {
  const addClient = useClientsStore((s) => s.addClient);
  const updateClient = useClientsStore((s) => s.updateClient);
  const allClients = useClientsStore((s) => s.clients);

  const params = useLocalSearchParams();
  const emailParam = params.email as string | undefined;
  const editingClient = emailParam
    ? allClients.find((c) => c.email === emailParam)
    : undefined;

  const {
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm<ClientForm>({
    resolver: zodResolver(clientSchema),
  });

  const [showPicker, setShowPicker] = useState(false);

  const name = watch("name");
  const email = watch("email");
  const birth = watch("birth");

  useEffect(() => {
    if (editingClient) {
      setValue("name", editingClient.name);
      setValue("email", editingClient.email);
      setValue("birth", editingClient.birth);
    }
  }, [editingClient]);

  function onSubmit(data: ClientForm) {
    if (editingClient) {
      updateClient(data);
      Alert.alert("Success", "Client updated successfully!");
    } else {
      addClient(data);
      Alert.alert("Success", "Client added successfully!");
    }
    router.replace("/clients");
  }

  return (
    <View className="flex-1 justify-center items-center px-6 bg-[#B6DAF4]">
      <View className="bg-white w-full rounded-2xl p-7 shadow-lg items-center">
        <MaterialCommunityIcons
          name={editingClient ? "pencil" : "account-plus"}
          size={48}
          color="#f59e42"
          style={{ marginBottom: 6 }}
        />
        <Text className="text-2xl font-extrabold mb-4 text-[#4292d8] tracking-wide">
          {editingClient ? "Edit Client" : "Add Client"}
        </Text>

        <TextInput
          className="border-2 border-[#62A7E7] w-full p-3 mb-2 rounded text-[#4292d8]"
          placeholder="Name"
          placeholderTextColor="#62A7E7"
          value={name}
          onChangeText={(t) => setValue("name", t)}
        />
        {errors.name && (
          <Text className="text-[#F86C6B] mb-2">{errors.name.message}</Text>
        )}
        <TextInput
          className={`border-2 w-full p-3 mb-2 rounded
    ${editingClient ? "bg-gray-100 text-gray-400 border-gray-300" : "bg-white text-[#4292d8] border-[#62A7E7]"}
  `}
          placeholder="E-mail"
          placeholderTextColor={editingClient ? "#b0b0b0" : "#62A7E7"}
          keyboardType="email-address"
          autoCapitalize="none"
          editable={!editingClient}
          value={email}
          onChangeText={(t) => setValue("email", t)}
        />
        {errors.email && (
          <Text className="text-[#F86C6B] mb-2">{errors.email.message}</Text>
        )}

        <TouchableOpacity
          className="border-2 border-[#62A7E7] w-full p-3 mb-4 rounded"
          onPress={() => setShowPicker(true)}
          activeOpacity={0.7}
        >
          <Text className={birth ? "text-[#4292d8]" : "text-gray-400"}>
            {birth ? birth : "Birth Date"}
          </Text>
        </TouchableOpacity>
        {showPicker && (
          <DateTimePicker
            value={birth ? new Date(birth) : new Date()}
            mode="date"
            display={Platform.OS === "ios" ? "spinner" : "default"}
            onChange={(_, date) => {
              setShowPicker(Platform.OS === "ios");
              if (date) {
                const yyyy = date.getFullYear();
                const mm = String(date.getMonth() + 1).padStart(2, "0");
                const dd = String(date.getDate()).padStart(2, "0");
                setValue("birth", `${yyyy}-${mm}-${dd}`);
              }
            }}
            maximumDate={new Date()}
          />
        )}
        {errors.birth && (
          <Text className="text-[#F86C6B] mb-2">{errors.birth.message}</Text>
        )}

        <TouchableOpacity
          className="bg-[#4292d8] rounded-xl px-4 py-3 w-full mt-2 shadow"
          activeOpacity={0.85}
          onPress={handleSubmit(onSubmit)}
        >
          <Text className="text-white font-bold text-center text-base">
            {editingClient ? "Update" : "Save"}
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}
