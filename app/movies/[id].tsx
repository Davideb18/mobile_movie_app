import { icons } from "@/constants/icons";
import { useSavedMovies } from "@/context/SavedMoviesContext";
import { fetchMovieDetails } from "@/services/api";
import useFetch from "@/services/useFetch";
import { router, useLocalSearchParams } from "expo-router";
import React, { useState } from "react";
import {
  Image,
  Modal,
  Pressable,
  ScrollView,
  Text,
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

  const { savedMovies, saveMovie, removeMovie } = useSavedMovies();

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

            {Object.keys(savedMovies).map((category) => {
              // 1. L'ispettore controlla se il film è già presente in questa categoria
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
                    // if the movie is already saved remove it passing the id in string format and the category
                    if (isSaved) {
                      removeMovie(movie!.id, category);
                    } else {
                      // else save it passing the movie and the category
                      saveMovie(movie, category);
                    }
                  }}
                >
                  <Text
                    className={`font-semibold text-center text-lg ${
                      isSaved ? "text-red-500" : "text-white"
                    }`}
                  >
                    {isSaved ? `Remove from ${category}` : `Add to ${category}`}
                  </Text>
                </Pressable>
              );
            })}

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
    </View>
  );
};

export default MovieDetails;
