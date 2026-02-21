import { Ionicons } from "@expo/vector-icons";
import { useState } from "react";
import {
    KeyboardTypeOptions,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from "react-native";

interface FormFieldProps {
  title: string;
  value: string;
  placeHolder?: string;
  handleChangeText: (e: string) => void;
  otherStyles?: string;
  keyboardType?: KeyboardTypeOptions;
}

const FormField = ({
  title,
  value,
  placeHolder,
  handleChangeText,
  otherStyles,
  ...props
}: FormFieldProps) => {
  const [showPassword, setShowPassword] = useState(false);
  return (
    <View className={`space-y-2 ${otherStyles}`}>
      {/* Title above input */}
      <Text className="text-base text-textMuted font-pmedium ml-1">
        {title}
      </Text>

      {/* Input Container */}
      <View className="border border-surfaceLight w-full h-16 px-4 bg-surfaceLight rounded-2xl focus:border-accent items-center flex-row">
        <TextInput
          className="flex-1 text-text font-psemibold text-base"
          value={value}
          placeholder={placeHolder}
          placeholderTextColor="#555555" // Tailwind very dark gray
          onChangeText={handleChangeText}
          secureTextEntry={title === "Password" && !showPassword}
          {...props}
        />

        {title === "Password" && (
          <TouchableOpacity onPress={() => setShowPassword(!showPassword)}>
            <Ionicons
              name={!showPassword ? "eye-outline" : "eye-off-outline"}
              size={24}
              color="#888888" // Muted gray
            />
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
};

export default FormField;
