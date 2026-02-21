import { Stack } from "expo-router";
import { StatusBar } from "react-native";
import { GlobalProvider } from "../context/GlobalProvider";
import "./globals.css";

export default function RootLayout() {
  return (
    <GlobalProvider>
      <>
        <StatusBar hidden={true} />
        <Stack>
          <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
          <Stack.Screen name="(auth)" options={{ headerShown: false }} />
          <Stack.Screen name="index" options={{ headerShown: false }} />
          <Stack.Screen
            name="movies/[id]"
            options={{ headerShown: false, presentation: "modal" }}
          />
        </Stack>
      </>
    </GlobalProvider>
  );
}
