import { icons } from "@/constants/icons";
import React, { forwardRef } from "react";
import { Image, Text, TextInput, TouchableOpacity, View } from "react-native";

interface Props {
  placeHolder: string;
  onPress?: () => void;
  value?: string;
  onChangeText?: (text: string) => void;
  onSubmitEditing?: () => void;
  autoFocus?: boolean;
  multiline?: boolean;
}

const SearchBar = forwardRef<TextInput, Props>(
  (
    {
      placeHolder,
      onPress,
      value,
      onChangeText,
      onSubmitEditing,
      autoFocus = false,
      multiline = false,
    },
    ref,
  ) => {
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
          onSubmitEditing={onSubmitEditing}
          placeholderTextColor="#666666"
          className={`flex-1 ml-3 text-text font-psemibold`}
          autoFocus={autoFocus}
          editable={onPress ? false : true}
          multiline={multiline}
          blurOnSubmit={multiline ? true : false}
        />

        {value && value.length > 0 && onChangeText && !onPress && (
          <TouchableOpacity
            onPress={() => onChangeText("")}
            className="ml-2 p-1"
          >
            <Text className="text-gray-400 text-lg font-bold">✕</Text>
          </TouchableOpacity>
        )}
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
