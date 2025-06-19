import { router } from "expo-router";
import { useEffect } from "react";
import { ActivityIndicator, Text, View } from "react-native";

export default function SplashScreen() {
  useEffect(() => {
    setTimeout(() => {
      router.replace("/login");
    }, 1500); 
  }, []);

  return (
    <View className="flex-1 items-center justify-center bg-white">
      <Text className="text-3xl font-bold">TrackToy</Text>
      <ActivityIndicator size="large" className="mt-4" />
    </View>
  );
}
