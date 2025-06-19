import { router, useNavigation } from "expo-router";
import LottieView from "lottie-react-native";
import { useEffect } from "react";
import { Text, View } from "react-native";

export default function SplashScreen() {
  const navigation = useNavigation();

  useEffect(() => {
    navigation.setOptions({
      headerShown: false,
    });
    
    const timer = setTimeout(() => {
      router.replace("/login");
    }, 1800);

    return () => clearTimeout(timer);
  }, [navigation]); 

  return (
    <View className="flex-1 items-center justify-center bg-white">
      <LottieView
        source={require("../assets/tracktoy-splash.json")}
        autoPlay
        loop
        style={{ width: 160, height: 160 }}
      />
      <Text className="text-3xl font-bold mt-4">TrackToy</Text>
    </View>
  );
}