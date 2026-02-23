import { icons } from "@/constants/icons";
import React, { forwardRef } from "react";
import { Image, TextInput, TouchableOpacity, View } from "react-native";

interface Props {
  placeHolder: string;
  onPress?: () => void;
  value?: string;
  onChangeText?: (text: string) => void;
  autoFocus?: boolean;
}

const SearchBar = forwardRef<TextInput, Props>(
  ({ placeHolder, onPress, value, onChangeText, autoFocus = false }, ref) => {
    const content = (
      <View className="flex-row items-center bg-surfaceLight rounded-full px-5 py-4 border border-white/5">
        <Image
          source={icons.search}
          className="size-5"
          resizeMode="contain"
          style={{ tintColor: "#FFFFFF" }}
        />

        <TextInput
          ref={ref}
          placeholder={placeHolder}
          value={value}
          onChangeText={onChangeText}
          placeholderTextColor="#666666"
          className="flex-1 ml-3 text-text font-psemibold"
          autoFocus={autoFocus}
          editable={onPress ? false : true}
        />
      </View>
    );

    if (onPress) {
      return (
        <View className="relative">
          {content}
          <TouchableOpacity
            style={{
              position: "absolute",
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              zIndex: 10,
            }}
            onPress={onPress}
            activeOpacity={0.7}
          />
        </View>
      );
    }

    return content;
  },
);

export default SearchBar;
