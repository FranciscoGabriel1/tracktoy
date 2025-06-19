import { zodResolver } from "@hookform/resolvers/zod";
import DateTimePicker from "@react-native-community/datetimepicker";
import { router, useLocalSearchParams } from "expo-router";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { Alert, Button, Platform, Text, TextInput, TouchableOpacity, View } from "react-native";
import { useClientsStore } from "../src/store/clientsStore";
import { ClientForm, clientSchema } from "../src/types/client";

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

  // Conecte os valores dos campos ao estado do React Hook Form
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
    <View className="flex-1 items-center justify-center px-6 bg-white">
      <Text className="text-2xl font-bold mb-6">
        {editingClient ? "Edit Client" : "Add Client"}
      </Text>
      <TextInput
        className="border w-full p-3 mb-2 rounded"
        placeholder="Name"
        value={name}
        onChangeText={(t) => setValue("name", t)}
      />
      {errors.name && (
        <Text className="text-red-600 mb-2">{errors.name.message}</Text>
      )}

      <TextInput
        className="border w-full p-3 mb-2 rounded"
        placeholder="E-mail"
        keyboardType="email-address"
        autoCapitalize="none"
        editable={!editingClient}
        value={email}
        onChangeText={(t) => setValue("email", t)}
      />
      {errors.email && (
        <Text className="text-red-600 mb-2">{errors.email.message}</Text>
      )}

      <TouchableOpacity
        className="border w-full p-3 mb-4 rounded"
        onPress={() => setShowPicker(true)}
        activeOpacity={0.7}
      >
        <Text className={birth ? "text-black" : "text-gray-400"}>
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
        <Text className="text-red-600 mb-2">{errors.birth.message}</Text>
      )}

      <Button
        title={editingClient ? "Update" : "Save"}
        onPress={handleSubmit(onSubmit)}
      />
    </View>
  );
}
