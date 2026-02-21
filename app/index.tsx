import CustomButton from "@/components/CustomButton";
import GlassView from "@/components/GlassView";
import { icons } from "@/constants/icons";
import { useGlobalContext } from "@/context/GlobalProvider";
import { Redirect, router } from "expo-router";
import { Image, ScrollView, Text, View } from "react-native";
import Animated, { FadeInDown } from "react-native-reanimated";
import { SafeAreaView } from "react-native-safe-area-context";

export default function App() {
  const { loading, isLogged } = useGlobalContext();

  if (!loading && isLogged) {
    return <Redirect href="/home" />;
  }

  return (
    <SafeAreaView className="bg-background h-full">
      <View className="flex-1 bg-background">
        <ScrollView contentContainerStyle={{ height: "100%" }}>
          <View className="w-full h-full justify-end px-4 pb-12">
            <Animated.View entering={FadeInDown.duration(800).springify()}>
              <GlassView
                className="w-full px-6 py-8 items-center rounded-3xl border border-white/5 bg-surface/80 shadow-none"
                intensity={15}
                tint="dark"
              >
                <Image
                  source={icons.logo}
                  className="w-[110px] h-[50px] mb-4"
                  resizeMode="contain"
                  style={{ tintColor: "#FFFFFF" }}
                />

                <View className="relative mb-6">
                  <Text className="text-3xl text-text font-pbold text-center leading-10">
                    Discover Endless Possibilities with{"\n"}
                    <Text className="text-accent">Aora</Text>
                  </Text>

                  <Text className="text-sm font-pregular text-textMuted mt-4 text-center px-2">
                    Where creativity meets innovation: embark on a journey of
                    limitless exploration.
                  </Text>
                </View>

                <CustomButton
                  title="Continue with Email"
                  handlePress={() => router.push("/sign-in")}
                  containerStyles="w-full mt-2"
                />
              </GlassView>
            </Animated.View>
          </View>
        </ScrollView>
      </View>
    </SafeAreaView>
  );
}
