import { icons } from "@/constants/icons";
import { fetchMovieDetails } from "@/services/api";
import useFetch from "@/services/useFetch";
import { router, useLocalSearchParams } from "expo-router";
import React from "react";
import { Image, ScrollView, Text, TouchableOpacity, View } from "react-native";

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
    </View>
  );
};

export default MovieDetails;
