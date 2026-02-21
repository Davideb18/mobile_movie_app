import { useGlobalContext } from "@/context/GlobalProvider";
import { logout } from "@/services/appwrite";
import { router } from "expo-router";
import React from "react";
import { Image, Text, TouchableOpacity, View } from "react-native";

const Profile = () => {
  const { user, setUser, setIsLogged } = useGlobalContext();

  const handleLogout = async () => {
    await logout();
    setUser(null);
    setIsLogged(false);
    router.replace("/sign-in");
  };

  return (
    <View className="bg-background flex-1 justify-center items-center">
      <View className="w-full justify-center items-center px-4">
        <View className="w-24 h-24 border border-white/10 rounded-full justify-center items-center bg-surfaceLight">
          <Image
            source={{ uri: user?.avatar }}
            className="w-[95%] h-[95%] rounded-full"
            resizeMode="cover"
          />
        </View>

        <Text className="text-text text-2xl font-psemibold mt-5">
          {user?.username}
        </Text>

        <TouchableOpacity onPress={handleLogout} className="w-full mt-10">
          <View className="w-full h-16 bg-surfaceLight border border-white/5 rounded-2xl justify-center items-center">
            <Text className="text-accent font-psemibold text-lg">Log Out</Text>
          </View>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default Profile;
