import { router } from "expo-router";
import { Button, Text, View } from "react-native";

export default function ClientsScreen() {
  return (
    <View className="flex-1 items-center justify-center bg-white">
      <Text className="text-xl mb-6">Clients</Text>
      <Button
        title="Go to Statistics"
        onPress={() => router.push("/statistics")}
      />
      <Button
        title="Add Client"
        onPress={() => router.push("/client-form")}
      />
    </View>
  );
}
