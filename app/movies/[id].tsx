import { icons } from "@/constants/icons";
import { useSavedMovies } from "@/context/SavedMoviesContext";
import { fetchMovieDetails } from "@/services/api";
import useFetch from "@/services/useFetch";
import { router, useLocalSearchParams } from "expo-router";
import React, { useState } from "react";
import {
  Image,
  Keyboard,
  KeyboardAvoidingView,
  Modal,
  Platform,
  Pressable,
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

interface MovieInfoProps {
  label: string;
  value?: string | number | null;
}

const MovieInfo = ({ label, value }: MovieInfoProps) => (
  <View className="flex-col items-start justify-center mt-5">
    <Text className="text-textMuted font-normal text-sm">{label}</Text>
    <Text className="text-text font-bold text-sm mt-2 leading-5">
      {value || "N/A"}
    </Text>
  </View>
);

const MovieDetails = () => {
  const { id } = useLocalSearchParams();

  const { data: movie, loading } = useFetch(() =>
    fetchMovieDetails(id as string),
  );

  const [modalVisible, setModalVisible] = useState(false);

  const [newCategory, setNewCategory] = useState("");

  const [isCreating, setIsCreating] = useState(false);

  const { savedMovies, saveMovie, removeMovie, createCategory } =
    useSavedMovies();

  if (loading || !movie) {
    return (
      <View className="bg-surface flex-1 items-center justify-center">
        <Text className="text-white text-lg font-bold">Loading movie...</Text>
      </View>
    );
  }

  // check if the movie is already saved
  const isMovieSaved = Object.values(savedMovies).some((categoryList) =>
    categoryList.some((m) => m.id === movie.id),
  );

  return (
    <View className="bg-surface flex-1">
      {/* Piccolo handle in alto per far capire che è una modale trascinabile */}
      <View className="w-12 h-1.5 bg-white/20 rounded-full mx-auto mt-3 mb-2" />

      <ScrollView contentContainerStyle={{ paddingBottom: 100 }}>
        <View className="px-5 mt-2">
          <Image
            source={{
              uri: `https://image.tmdb.org/t/p/w500${movie?.poster_path}`,
            }}
            className="w-full h-[500px] rounded-3xl"
            resizeMode="cover"
          />

          {/* the botton to saved the movies */}
          <Pressable
            onPress={() => setModalVisible(true)}
            className={`absolute top-6 right-8 p-3 rounded-full border border-white/10 shadow-lg ${
              isMovieSaved ? "bg-red-600" : "bg-surface/80"
            }`}
            style={({ pressed }) => ({
              opacity: pressed ? 0.7 : 1,
            })}
          >
            <Image
              source={icons.save}
              className="size-6"
              style={{ tintColor: "#FFFFFF" }}
            />
          </Pressable>
        </View>

        <View className="flex-col items-start justify-center mt-6 px-5">
          <Text className="text-text font-pbold text-2xl">{movie?.title}</Text>

          <View className="flex-row items-center gap-x-3 mt-3">
            <Text className="text-textMuted font-pmedium text-sm">
              {movie?.release_date?.split("-")[0]}
            </Text>
            <Text className="text-textMuted font-pmedium text-sm">
              {movie?.runtime}m
            </Text>
          </View>

          <View className="flex-row items-center bg-surfaceLight px-3 py-1.5 rounded-xl gap-x-2 mt-4 border border-white/5">
            <Image source={icons.star} className="size-4" />
            <Text className="text-text font-bold text-sm">
              {Math.round(movie?.vote_average ?? 0)}/10
            </Text>
            <Text className="text-textMuted text-xs ml-1">
              ({movie?.vote_count} votes)
            </Text>
          </View>

          <MovieInfo label="Overview" value={movie?.overview} />
          <MovieInfo
            label="Genres"
            value={movie?.genres?.map((g) => g.name).join(" • ") || "N/A"}
          />

          <View className="flex flex-row justify-between w-[90%] flex-wrap">
            <MovieInfo
              label="Budget"
              value={`$${(movie?.budget || 0) / 1_000_000}M`}
            />
            <MovieInfo
              label="Revenue"
              value={`$${Math.round((movie?.revenue || 0) / 1_000_000)}M`}
            />
          </View>

          <MovieInfo
            label="Production Companies"
            value={
              movie?.production_companies.map((c) => c.name).join(" • ") ||
              "N/A"
            }
          />
        </View>
      </ScrollView>

      <View className="absolute bottom-6 left-0 right-0 px-5">
        <TouchableOpacity
          className="bg-surfaceLight border border-white/5 rounded-full py-4 flex flex-row items-center justify-center shadow-lg"
          onPress={router.back}
        >
          <Text className="text-text font-psemibold text-base">
            Close window
          </Text>
        </TouchableOpacity>
      </View>

      {/* This is the modal that open when you want to save a movie */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <Pressable
          className="flex-1 justify-end"
          onPress={() => setModalVisible(false)}
        >
          <Pressable className="bg-neutral-900/95 rounded-t-3xl p-6 border-t border-white/10">
            <Text className="text-white text-2xl font-bold mb-6 text-center">
              Add to list
            </Text>

            {/* Pulsante che apre il popup esterno */}
            <Pressable
              className="py-4 mb-6 rounded-xl border border-dashed border-stone-400 bg-transparent flex items-center justify-center"
              style={({ pressed }) => ({ opacity: pressed ? 0.7 : 1 })}
              onPress={() => {
                setModalVisible(false); // Nascondi modale list
                setIsCreating(true); // Mostra popup input
              }}
            >
              <Text className="text-gray-300 font-semibold text-lg">
                + Create Custom Category
              </Text>
            </Pressable>

            {/* Lista Scrollabile delle categorie */}
            <ScrollView
              className="max-h-[350px] mb-4"
              showsVerticalScrollIndicator={false}
              key={Object.keys(savedMovies).length} // FORZA IL RE-RENDER IMMEDIATO quando aggiungi una categoria!
            >
              {Object.keys(savedMovies).map((category) => {
                // Controlla se il film è già presente in questa categoria
                const isSaved = savedMovies[category].some(
                  (m) => m.id === movie?.id,
                );

                return (
                  <Pressable
                    key={category}
                    className={`py-4 mb-3 rounded-xl border ${
                      isSaved
                        ? "bg-red-500/10 border-red-500"
                        : "bg-gray-600 border-stone-200"
                    }`}
                    style={({ pressed }) => ({
                      opacity: pressed ? 0.7 : 1,
                    })}
                    onPress={() => {
                      if (isSaved) {
                        removeMovie(movie!.id, category);
                      } else {
                        saveMovie(movie, category);
                      }
                    }}
                  >
                    <Text
                      className={`font-semibold text-center text-lg ${
                        isSaved ? "text-red-500" : "text-white"
                      }`}
                    >
                      {isSaved
                        ? `Remove from ${category}`
                        : `Add to ${category}`}
                    </Text>
                  </Pressable>
                );
              })}
            </ScrollView>

            <TouchableOpacity
              className="mt-6 py-4 bg-dark-100 rounded-xl"
              onPress={() => setModalVisible(false)}
            >
              <Text className="text-white font-bold text-center text-lg">
                Cancel
              </Text>
            </TouchableOpacity>
          </Pressable>
        </Pressable>
      </Modal>

      {/* ------------------- CREATE NEW CATEGORY POPUP (Absolute View invece di Modal) ------------------- */}
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
                  // Un piccolo ritardo per far scendere la tastiera prima di riaprire la lista
                  setTimeout(() => setModalVisible(true), 150);
                }}
              >
                <Text className="text-white font-bold text-lg">Cancel</Text>
              </Pressable>

              <Pressable
                className="flex-1 bg-accent py-4 rounded-xl items-center"
                onPress={() => {
                  console.log("Saving category:", newCategory);
                  if (newCategory.trim() === "") {
                    Keyboard.dismiss();
                    setIsCreating(false);
                    setTimeout(() => setModalVisible(true), 150);
                    return;
                  }

                  createCategory(newCategory); // CREA LA CATEGORIA, NON SALVARE IL FILM!

                  Keyboard.dismiss();
                  setIsCreating(false);
                  setNewCategory("");
                  setTimeout(() => setModalVisible(true), 150);
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

export default MovieDetails;
