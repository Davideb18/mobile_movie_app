import { icons } from "@/constants/icons";
import { Tabs } from "expo-router";
import React from "react";
import { Image, Text, View } from "react-native";

const TabIcon = ({ focused, icon, title }: any) => {
  if (focused) {
    return (
      <View className="flex flex-row w-full flex-1 min-w-[112px] min-h-16 mt-4 justify-center items-center rounded-full bg-accent/20">
        <Image
          source={icon}
          style={{ tintColor: "#6366f1" }}
          className="size-5"
        />
        <Text className="text-accent text-base font-semibold ml-2">
          {title}
        </Text>
      </View>
    );
  }

  return (
    <View className="size-full justify-center items-center mt-4 rounded-full">
      <Image
        source={icon}
        style={{ tintColor: "#888888" }}
        className="size-5"
      />
    </View>
  );
};

const _Layout = () => {
  return (
    <Tabs
      screenOptions={{
        tabBarShowLabel: false,
        tabBarItemStyle: {
          width: "100%",
          height: "100%",
          justifyContent: "center",
          alignItems: "center",
        },
        tabBarStyle: {
          backgroundColor: "#111111",
          borderRadius: 50,
          marginHorizontal: 20,
          marginBottom: 36,
          height: 58,
          position: "absolute",
          overflow: "hidden",
          borderWidth: 1,
          borderColor: "rgba(255, 255, 255, 0.05)",
        },
      }}
    >
      {/* --- TAB HOME --- */}
      <Tabs.Screen
        name="home"
        options={{
          title: "Home",
          headerShown: false, // Nasconde l'header in alto
          tabBarIcon: (
            { focused }, // focused e il valore che viene passato
          ) => (
            // quando si preme sulla Barra esso può essere TRUE o FALSE in base a quale tasto premiamo ed è l'unico valore
            // che serve preso dall'input
            // Se non scrivi { focused } dentro le parentesi, stai semplicemente dicendo:
            // "Non mi interessa sapere in che stato si trova il bottone, io disegno l'icona sempre allo stesso modo".
            <TabIcon focused={focused} icon={icons.home} title="Home" />
          ),
        }}
      />

      {/* --- TAB SEARCH --- */}
      <Tabs.Screen
        name="search"
        options={{
          title: "Search",
          headerShown: false,
          tabBarIcon: ({ focused }) => (
            <TabIcon focused={focused} icon={icons.search} title="Search" />
          ),
        }}
      />

      {/* --- TAB SAVED --- */}
      <Tabs.Screen
        name="saved"
        options={{
          title: "Saved",
          headerShown: false,
          tabBarIcon: ({ focused }) => (
            <TabIcon focused={focused} icon={icons.save} title="Saved" />
          ),
        }}
      />

      {/* --- TAB PROFILE --- */}
      <Tabs.Screen
        name="profile"
        options={{
          title: "Profile",
          headerShown: false,
          tabBarIcon: ({ focused }) => (
            <TabIcon focused={focused} icon={icons.person} title="Profile" />
          ),
        }}
      />
    </Tabs>
  );
};

export default _Layout;
