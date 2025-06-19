import { zodResolver } from "@hookform/resolvers/zod";
import { router } from "expo-router";
import { useForm } from "react-hook-form";
import { Button, Text, TextInput, View } from "react-native";
import { z } from "zod";
import { useAuthStore } from "../src/store/authStore";

const loginSchema = z.object({
  email: z.string().email("Invalid email"),
  password: z.string().min(4, "Minimum 4 characters"),
});

type LoginForm = z.infer<typeof loginSchema>;

export default function LoginScreen() {
  const login = useAuthStore((s) => s.login);
  const {
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<LoginForm>({
    resolver: zodResolver(loginSchema),
  });

  const onSubmit = (data: LoginForm) => {
    login();
    router.replace("/clients");
  };

  return (
    <View className="flex-1 justify-center items-center px-6 bg-white">
      <Text className="text-2xl font-bold mb-6">Login</Text>
      <TextInput
        className="border w-full p-3 mb-2 rounded"
        placeholder="E-mail"
        autoCapitalize="none"
        keyboardType="email-address"
        onChangeText={(t) => setValue("email", t)}
      />
      {errors.email && (
        <Text className="text-red-600 mb-2">{errors.email.message}</Text>
      )}
      <TextInput
        className="border w-full p-3 mb-2 rounded"
        placeholder="Password"
        secureTextEntry
        onChangeText={(t) => setValue("password", t)}
      />
      {errors.password && (
        <Text className="text-red-600 mb-2">{errors.password.message}</Text>
      )}
      <Button title="Login" onPress={handleSubmit(onSubmit)} />
    </View>
  );
}
