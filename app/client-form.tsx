import { zodResolver } from "@hookform/resolvers/zod";
import { router } from "expo-router";
import { useForm } from "react-hook-form";
import { Alert, Button, Text, TextInput, View } from "react-native";
import { useClientsStore } from "../src/store/clientsStore";
import { ClientForm, clientSchema } from "../src/types/client";

export default function ClientFormScreen() {
  const addClient = useClientsStore((s) => s.addClient);

  const {
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<ClientForm>({
    resolver: zodResolver(clientSchema),
  });

  function onSubmit(data: ClientForm) {
    addClient(data);
    Alert.alert("Success", "Client added successfully!");
    router.replace("/clients");
  }

  return (
    <View className="flex-1 items-center justify-center px-6 bg-white">
      <Text className="text-2xl font-bold mb-6">Add Client</Text>
      <TextInput
        className="border w-full p-3 mb-2 rounded"
        placeholder="Name"
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
        onChangeText={(t) => setValue("email", t)}
      />
      {errors.email && (
        <Text className="text-red-600 mb-2">{errors.email.message}</Text>
      )}

      <TextInput
        className="border w-full p-3 mb-4 rounded"
        placeholder="Birth Date (YYYY-MM-DD)"
        onChangeText={(t) => setValue("birth", t)}
      />
      {errors.birth && (
        <Text className="text-red-600 mb-2">{errors.birth.message}</Text>
      )}

      <Button title="Save" onPress={handleSubmit(onSubmit)} />
    </View>
  );
}
