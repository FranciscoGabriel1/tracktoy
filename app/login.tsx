import { useAuthStore } from "@/store/authStore";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { zodResolver } from "@hookform/resolvers/zod";
import { router, useNavigation } from "expo-router";
import { JSX, useEffect } from "react";
import { useForm } from "react-hook-form";
import { Text, TextInput, TouchableOpacity, View } from "react-native";
import { z } from "zod";

const loginSchema = z.object({
  email: z.string().email("Invalid email"),
  password: z.string().min(4, "Minimum 4 characters"),
});

type LoginForm = z.infer<typeof loginSchema>;

const LoginScreen = (): JSX.Element => {
  const navigation = useNavigation();
  useEffect(() => {
    navigation.setOptions({ headerShown: false });
  }, [navigation]);

  const login = useAuthStore((s) => s.login);
  const {
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<LoginForm>({ resolver: zodResolver(loginSchema) });

  const onSubmit = (data: LoginForm) => {
    login();
    router.replace("/clients");
  };

  return (
    <View className="flex-1 justify-center items-center px-6 bg-[#B6DAF4]">
      <MaterialCommunityIcons
        name="teddy-bear"
        size={60}
        color="#4292d8"
        style={{ marginBottom: 16 }}
      />
      <Text className="text-3xl font-extrabold mb-7 text-[#4292d8] tracking-wide">
        TrackToy
      </Text>
      <View className="bg-white w-full rounded-2xl p-6 shadow-lg items-center">
        <Text className="text-2xl font-bold mb-6 text-[#4292d8]">Login</Text>
        <TextInput
          className="border-2 border-[#62A7E7] w-full p-3 mb-2 rounded text-[#4292d8]"
          placeholder="E-mail"
          placeholderTextColor="#62A7E7"
          autoCapitalize="none"
          keyboardType="email-address"
          onChangeText={(t) => setValue("email", t)}
        />
        {errors.email && (
          <Text className="text-[#F86C6B] mb-2">{errors.email.message}</Text>
        )}
        <TextInput
          className="border-2 border-[#62A7E7] w-full p-3 mb-2 rounded text-[#4292d8]"
          placeholder="Password"
          placeholderTextColor="#62A7E7"
          secureTextEntry
          onChangeText={(t) => setValue("password", t)}
        />
        {errors.password && (
          <Text className="text-[#F86C6B] mb-2">{errors.password.message}</Text>
        )}

        <TouchableOpacity
          className="bg-[#4292d8] rounded-xl px-4 py-3 w-full mt-2 shadow"
          activeOpacity={0.85}
          onPress={handleSubmit(onSubmit)}
        >
          <Text className="text-white font-bold text-center text-base">
            Login
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default LoginScreen;
