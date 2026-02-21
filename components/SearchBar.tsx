import { icons } from "@/constants/icons";
import React from "react";
import { Image, TextInput, View } from "react-native";

interface Props {
  placeHolder: string;
  onPress?: () => void;
  value?: string;
  onChangeText?: (text: string) => void;
  autoFocus?: boolean;
}

const SearchBar = ({
  placeHolder,
  onPress,
  value,
  onChangeText,
  autoFocus = false,
}: Props) => {
  return (
    <View className="flex-row items-center bg-surfaceLight rounded-full px-5 py-4 border border-white/5">
      <Image
        source={icons.search}
        className="size-5"
        resizeMode="contain"
        style={{ tintColor: "#FFFFFF" }} // White minimalist icon
      />

      <TextInput
        onPress={onPress}
        placeholder={placeHolder}
        value={value}
        onChangeText={onChangeText}
        placeholderTextColor="#666666" // Muted dark gray placeholder
        className="flex-1 ml-3 text-text font-psemibold" // Using text-text (white) and semi-bold
        autoFocus={autoFocus}
      />
    </View>
  );
};

export default SearchBar;
