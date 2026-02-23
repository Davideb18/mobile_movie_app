import CustomButton from "@/components/CustomButton";
import FormField from "@/components/FormField";
import GlassView from "@/components/GlassView";
import { icons } from "@/constants/icons";
import { useGlobalContext } from "@/context/GlobalProvider";
import { getCurrentUser, signIn } from "@/services/appwrite";
import { Link, Redirect, router } from "expo-router";
import React, { useState } from "react";
import { Alert, Image, ScrollView, Text, View } from "react-native";
import Animated, { FadeInDown } from "react-native-reanimated";
import { SafeAreaView } from "react-native-safe-area-context";

const SignIn = () => {
  const { setUser, setIsLogged, isLogged, loading } = useGlobalContext();

  if (!loading && isLogged) {
    return <Redirect href="/home" />;
  }
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [form, setForm] = useState({
    email: "",
    password: "",
  });

  const submit = async () => {
    if (!form.email || !form.password) {
      Alert.alert("Error", "Please fill in all the fields");
      return;
    }

    setIsSubmitting(true);

    try {
      await signIn(form.email, form.password);
      const result = await getCurrentUser();
      setUser(result);
      setIsLogged(true);

      router.replace("/home");
    } catch (error: any) {
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
                  Welcome Back
                </Text>
                <Text className="text-textMuted text-sm mt-2 text-center">
                  Log in to continue your journey
                </Text>
              </View>

              <FormField
                title="Email"
                value={form.email}
                handleChangeText={(e) => setForm({ ...form, email: e })}
                otherStyles="mt-4"
                keyboardType="email-address"
              />

              <FormField
                title="Password"
                value={form.password}
                handleChangeText={(e) => setForm({ ...form, password: e })}
                otherStyles="mt-6"
              />

              <CustomButton
                title="Sign In"
                handlePress={submit}
                containerStyles="mt-8 w-full"
                isLoading={isSubmitting}
              />

              <View className="justify-center flex-row gap-2 pt-6 pb-2">
                <Text className="text-textMuted text-base font-pregular">
                  Don't have an account?
                </Text>
                <Link
                  href="/sign-up"
                  className="text-base font-psemibold text-accent"
                >
                  Sign Up
                </Link>
              </View>
            </GlassView>
          </Animated.View>
        </ScrollView>
      </View>
    </SafeAreaView>
  );
};

export default SignIn;
