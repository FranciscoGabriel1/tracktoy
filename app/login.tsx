import { router } from "expo-router";
import { Button, Text, View } from "react-native";

export default function LoginScreen() {
  // Futuramente: autenticação real
  return (
    <View className="flex-1 items-center justify-center bg-white">
      <Text className="text-xl mb-6">Login</Text>
      <Button
        title="Enter"
        onPress={() => router.replace("/clients")}
      />
    </View>
  );
}
