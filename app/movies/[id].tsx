import MovieRating from "@/components/MovieRating";
import { icons } from "@/constants/icons";
import { useSavedMovies } from "@/context/SavedMoviesContext";
import { fetchMovieDetails } from "@/services/api";
import useFetch from "@/services/useFetch";
import { Ionicons } from "@expo/vector-icons";
import * as Haptics from "expo-haptics";
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
  Share,
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

  const { savedMovies, saveMovie, removeMovie, createCategory, rateMovie } =
    useSavedMovies();

  if (loading || !movie) {
    return (
      <View className="bg-surface flex-1 items-center justify-center">
        <Text className="text-white text-lg font-bold">Loading movie...</Text>
      </View>
    );
  }

  // check if this movie is already in one of the user's lists
  const isMovieSaved = Object.values(savedMovies).some((categoryList) =>
    categoryList.some((m) => m.id === movie.id),
  );

  return (
    <View className="bg-surface flex-1">
      {/* drag handle at the top */}
      <View className="w-12 h-1.5 bg-white/20 rounded-full mx-auto mt-3 mb-2" />

      <ScrollView contentContainerStyle={{ paddingBottom: 100 }}>
        <View className="px-5 mt-2">
          <Image
            source={{
              uri: `https://image.tmdb.org/t/p/w500${movie?.poster_path}`,
            }}
            style={{ width: "100%", height: 500, borderRadius: 24 }}
            resizeMode="cover"
          />

          {/* save button — turns red when the movie is already saved */}
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
              style={{ width: 24, height: 24, tintColor: "#FFFFFF" }}
            />
          </Pressable>

          {/* share button */}
          <Pressable
            onPress={async () => {
              Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
              try {
                if (!movie) return;
                await Share.share({
                  message: `Check out this movie I found: ${movie.title}! 🍿\nFind more details on TMDB: https://www.themoviedb.org/movie/${movie.id}`,
                });
              } catch (error) {
                console.log("Error sharing", error);
              }
            }}
            className="absolute top-6 right-[88px] p-3 rounded-full border border-white/10 shadow-lg bg-surface/80 h-[50px] w-[50px] items-center justify-center"
            style={({ pressed }) => ({
              opacity: pressed ? 0.7 : 1,
            })}
          >
            <Ionicons
              name="share-social-outline"
              size={22}
              color="#FFFFFF"
              style={{ marginLeft: -2 }}
            />
          </Pressable>
        </View>

        <View className="flex-col items-start justify-center mt-6 px-5">
          <Text className="text-text font-bold text-3xl">{movie?.title}</Text>

          {Object.values(savedMovies).some((list) =>
            list.some((m) => m.id === movie.id),
          ) && (
            <View className="mt-2 text-white">
              <MovieRating
                rating={
                  Object.values(savedMovies)
                    .flat()
                    .find((m) => m.id === movie.id)?.$rating ?? 0
                }
                onRate={(stars) => {
                  const category = Object.keys(savedMovies).find((cat) =>
                    savedMovies[cat].some((m) => m.id === movie.id),
                  );
                  if (category) rateMovie(movie.id, category, stars);
                }}
                size={24}
              />
            </View>
          )}
          <View className="flex-row items-center gap-x-3 mt-3">
            <Text className="text-textMuted font-pmedium text-sm">
              Years: {movie?.release_date?.split("-")[0]}
            </Text>
            <Text className="text-textMuted font-pmedium text-sm">
              Duration: {movie?.runtime}m
            </Text>
          </View>

          <View className="flex-row items-center bg-surfaceLight px-3 py-1.5 rounded-xl gap-x-2 mt-4 border border-white/5">
            <Image
              source={icons.star}
              style={{ width: 16, height: 16 }}
              resizeMode="contain"
            />
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
            {movie?.budget && movie.budget > 0 ? (
              <MovieInfo
                label="Budget"
                value={`$${Math.round(movie.budget / 1_000_000)}M`}
              />
            ) : null}
            {movie?.revenue && movie.revenue > 0 ? (
              <MovieInfo
                label="Revenue"
                value={`$${Math.round(movie.revenue / 1_000_000)}M`}
              />
            ) : null}
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

      {/* bottom sheet modal for picking which list to add the movie to */}
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

            {/* opens the category creation input, hiding this list first */}
            <Pressable
              className="py-4 mb-6 rounded-xl border border-dashed border-stone-400 bg-transparent flex items-center justify-center"
              style={({ pressed }) => ({ opacity: pressed ? 0.7 : 1 })}
              onPress={() => {
                setModalVisible(false);
                setIsCreating(true);
              }}
            >
              <Text className="text-gray-300 font-semibold text-lg">
                + Create Custom Category
              </Text>
            </Pressable>

            {/* scrollable list of the user's categories */}
            <ScrollView
              className="max-h-[350px] mb-4"
              showsVerticalScrollIndicator={false}
              key={Object.keys(savedMovies).length} // key changes when a new category is added, forcing a re-render
            >
              {Object.keys(savedMovies).map((category) => {
                // check if this movie is already in the current category
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
                      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
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

      {/* new category input — rendered as an absolute overlay instead of a nested Modal to avoid stacking issues */}
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
                  // small delay to let the keyboard dismiss before reopening the list
                  setTimeout(() => setModalVisible(true), 150);
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
                    setTimeout(() => setModalVisible(true), 150);
                    return;
                  }

                  createCategory(newCategory);

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
