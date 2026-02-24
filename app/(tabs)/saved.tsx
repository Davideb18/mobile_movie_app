import { icons } from "@/constants/icons";
import { useSavedMovies } from "@/context/SavedMoviesContext";
import { Link } from "expo-router";
import React, { useState } from "react";
import {
  Alert,
  FlatList,
  Image,
  Keyboard,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

const Saved = () => {
  const { savedMovies, deleteCategory, createCategory } = useSavedMovies();
  const [isCreating, setIsCreating] = useState(false);
  const [newCategory, setNewCategory] = useState("");

  const categories = Object.keys(savedMovies);

  const handleDeleteCategory = (category: string) => {
    const movieCount = savedMovies[category].length;

    if (movieCount > 0) {
      Alert.alert(
        "Delete Category",
        `Are you sure you want to delete "${category}"? It contains ${movieCount} movie${movieCount > 1 ? "s" : ""}.`,
        [
          { text: "Cancel", style: "cancel" },
          {
            text: "Delete",
            style: "destructive",
            onPress: () => deleteCategory(category),
          },
        ],
      );
    } else {
      deleteCategory(category);
    }
  };
  return (
    <View className="flex-1 bg-background">
      <ScrollView
        className="flex-1 px-5"
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{
          minHeight: "100%",
          paddingBottom: 10,
          paddingTop: 40,
        }}
      >
        <Image
          source={icons.logo}
          className="w-[115px] h-[35px] mt-10 mb-8 mx-auto"
          resizeMode="contain"
          style={{ tintColor: "#FFFFFF" }}
        />

        <View className="flex-row items-center justify-between mt-5 mb-4">
          <Text className="text-2xl text-text font-psemibold">
            Saved Collections
          </Text>
          <TouchableOpacity
            className="bg-accent/20 px-4 py-2 rounded-full border border-accent"
            onPress={() => setIsCreating(true)}
          >
            <Text className="text-accent font-bold">+ New</Text>
          </TouchableOpacity>
        </View>

        <View className="mt-8">
          {categories.map((category) => (
            <View key={category} className="mb-8 block">
              <View className="flex-row justify-between items-center mb-4 block">
                <Text className="text-white text-xl font-bold flex-shrink">
                  {category}
                </Text>
                {category !== "Want to Watch" &&
                  category !== "Already Watched" && (
                    <TouchableOpacity
                      onPress={() => handleDeleteCategory(category)}
                      className="p-2 ml-2"
                    >
                      {/* Replace with a proper icon if available, normally we'd import an SVG. A simple text works for now */}
                      <Text className="text-red-500 font-bold text-xs bg-red-500/10 px-3 py-1.5 rounded-full border border-red-500/20">
                        Delete
                      </Text>
                    </TouchableOpacity>
                  )}
              </View>

              <FlatList
                data={savedMovies[category]}
                horizontal={true}
                showsHorizontalScrollIndicator={false}
                ListEmptyComponent={() => (
                  <View className="bg-slate-200/20 border border-white/5 rounded-2xl p-4 justify-center items-center">
                    <Text className="text-textMuted text-sm italic text-center">
                      No movies saved in this list yet.
                    </Text>
                  </View>
                )}
                keyExtractor={(item) => item.id.toString()}
                renderItem={({ item }) => (
                  <Link href={`/movies/${item.id}`} asChild>
                    <TouchableOpacity className="mr-5 w-36">
                      <Image
                        source={{
                          uri: item.poster_path
                            ? `https://image.tmdb.org/t/p/w500${item.poster_path}`
                            : "https://placehold.co/600x400/1a1a1a/ffffff.png",
                        }}
                        className="w-full h-52 rounded-2xl"
                        resizeMode="cover"
                      />
                      <Text
                        className="text-sm font-bold text-text mt-2 text-left"
                        numberOfLines={1}
                      >
                        {item.title}
                      </Text>
                    </TouchableOpacity>
                  </Link>
                )}
              />
            </View>
          ))}
        </View>
      </ScrollView>

      {/* ------------------- CREATE NEW CATEGORY POPUP ------------------- */}
      {isCreating && (
        <KeyboardAvoidingView
          behavior={Platform.OS === "ios" ? "padding" : "height"}
          className="absolute inset-0 z-50 flex-1 justify-center items-center bg-black/80 px-5"
        >
          <View className="w-full bg-surfaceLight p-6 rounded-3xl border border-white/10 shadow-2xl">
            <Text className="text-white text-xl font-bold mb-4 text-center">
              New Category Name
            </Text>

            <TextInput
              className="w-full bg-gray-600 border border-stone-200 rounded-xl px-4 py-4 text-white font-semibold text-lg mb-4"
              placeholder="e.g. Masterpieces"
              placeholderTextColor="#A0A0A0"
              value={newCategory}
              onChangeText={(text) => setNewCategory(text)}
              autoFocus={true}
            />

            <View className="flex-row gap-x-3 w-full">
              <Pressable
                className="flex-1 bg-dark-100 py-4 rounded-xl items-center"
                onPress={() => {
                  Keyboard.dismiss();
                  setIsCreating(false);
                  setNewCategory("");
                }}
              >
                <Text className="text-white font-bold text-lg">Cancel</Text>
              </Pressable>

              <Pressable
                className="flex-1 bg-accent py-4 rounded-xl items-center"
                onPress={() => {
                  if (newCategory.trim() === "") {
                    Keyboard.dismiss();
                    setIsCreating(false);
                    return;
                  }

                  createCategory(newCategory);

                  Keyboard.dismiss();
                  setIsCreating(false);
                  setNewCategory("");
                }}
              >
                <Text className="text-white font-bold text-lg">Create</Text>
              </Pressable>
            </View>
          </View>
        </KeyboardAvoidingView>
      )}
    </View>
  );
};

export default Saved;
