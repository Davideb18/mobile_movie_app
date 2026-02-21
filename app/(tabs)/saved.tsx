import { icons } from "@/constants/icons";
import React from "react";
import { Image, ScrollView, Text, View } from "react-native";

const Saved = () => {
  return (
    <View className="flex-1 bg-background">
      <ScrollView
        className="flex-1 px-5"
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ minHeight: "100%", paddingBottom: 10 }}
      >
        <Image
          source={icons.logo}
          className="w-12 h-10 mt-20 mb-5 mx-auto"
          style={{ tintColor: "#FFFFFF" }}
        />

        <Text className="text-text text-3xl font-bold text-center mt-5">
          SAVED FILE
        </Text>
      </ScrollView>
    </View>
  );
};

export default Saved;
