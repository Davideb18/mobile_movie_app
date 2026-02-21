import CustomButton from "@/components/CustomButton";
import FormField from "@/components/FormField";
import GlassView from "@/components/GlassView";
import { icons } from "@/constants/icons";
import { useGlobalContext } from "@/context/GlobalProvider";
import { createUser, logout } from "@/services/appwrite";
import { Link, router } from "expo-router";
import React, { useState } from "react";
import { Alert, Image, ScrollView, Text, View } from "react-native";
import Animated, { FadeInDown } from "react-native-reanimated";
import { SafeAreaView } from "react-native-safe-area-context";

const SignUp = () => {
  const { setUser, setIsLogged } = useGlobalContext();

  const [form, setForm] = useState({
    username: "",
    email: "",
    password: "",
  });

  const [isSubmitting, setIsSubmitting] = useState(false);

  const submit = async () => {
    try {
      await logout();
    } catch (e) {
      console.log(e);
    }

    if (!form.username || !form.email || !form.password) {
      Alert.alert("Error", "Please fill in all the fields");
      return;
    }

    setIsSubmitting(true);

    try {
      const result = await createUser(form.email, form.password, form.username);
      setUser(result);
      setIsLogged(true);

      router.replace("/home");
    } catch (error: any) {
      console.log("ERRORE CRITICO:", error);
      Alert.alert("Error", error.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <SafeAreaView className="bg-background h-full">
      <View className="flex-1 bg-background">
        <ScrollView contentContainerStyle={{ height: "100%" }}>
          <Animated.View
            entering={FadeInDown.duration(800).springify()}
            style={{ flex: 1, justifyContent: "center" }}
          >
            <GlassView
              className="mx-4 p-6 justify-center rounded-3xl border border-white/5 bg-surface/80"
              intensity={20}
              tint="dark"
            >
              <View className="items-center mb-6">
                <Image
                  source={icons.logo}
                  resizeMode="contain"
                  className="w-[115px] h-[35px]"
                  style={{ tintColor: "#FFFFFF" }}
                />
                <Text className="text-2xl text-text font-psemibold mt-6 text-center">
                  Create Account
                </Text>
                <Text className="text-textMuted text-sm mt-2 text-center">
                  Join our community today
                </Text>
              </View>

              <FormField
                title="Username"
                value={form.username}
                handleChangeText={(e) => setForm({ ...form, username: e })}
                otherStyles="mt-4"
              />

              <FormField
                title="Email"
                value={form.email}
                handleChangeText={(e) => setForm({ ...form, email: e })}
                otherStyles="mt-6"
                keyboardType="email-address"
              />

              <FormField
                title="Password"
                value={form.password}
                handleChangeText={(e) => setForm({ ...form, password: e })}
                otherStyles="mt-6"
              />

              <CustomButton
                title="Sign Up"
                handlePress={submit}
                containerStyles="mt-8"
                isLoading={isSubmitting}
              />

              <View className="justify-center pt-6 pb-2 flex-row gap-2">
                <Text className="text-base text-textMuted font-pregular">
                  Already have an account?
                </Text>
                <Link
                  href="/sign-in"
                  className="text-base font-psemibold text-accent"
                >
                  Sign In
                </Link>
              </View>
            </GlassView>
          </Animated.View>
        </ScrollView>
      </View>
    </SafeAreaView>
  );
};

export default SignUp;
