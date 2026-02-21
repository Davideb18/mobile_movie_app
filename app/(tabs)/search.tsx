import MovieCard from "@/components/MovieCard";
import SearchBar from "@/components/SearchBar";
import { icons } from "@/constants/icons";
import { fetchMovies } from "@/services/api";
import { updateSearchCount } from "@/services/appwrite";
import useFetch from "@/services/useFetch";
import { useLocalSearchParams } from "expo-router";
import React, { useEffect, useState } from "react";
import { ActivityIndicator, FlatList, Image, Text, View } from "react-native";

const Search = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const params = useLocalSearchParams<{ autoFocus?: string }>(); // Recuperiamo i parametri

  const {
    data: movies,
    loading: loading,
    error: error,
    refetch: loadMovies,
  } = useFetch(() =>
    fetchMovies({
      query: searchQuery,
    }),
  );

  useEffect(() => {
    const timeoutId = setTimeout(async () => {
      await loadMovies();
    }, 500);
    return () => clearTimeout(timeoutId);
  }, [searchQuery]);

  useEffect(() => {
    if (movies?.[0] && movies?.length > 0) {
      updateSearchCount(searchQuery, movies[0]);
    }
  }, [movies]);

  return (
    <View className="flex-1 bg-background">
      <FlatList
        data={movies}
        renderItem={({ item }) => <MovieCard {...item} />}
        keyExtractor={(item) => item.id.toString()}
        className="px-5"
        numColumns={3}
        columnWrapperStyle={{
          justifyContent: "flex-start",
          gap: 16,
          marginVertical: 16,
        }}
        contentContainerStyle={{ paddingBottom: 100 }}
        ListHeaderComponent={
          <>
            <View className="w-full flex-row justify-center mt-20 items-center">
              <Image
                source={icons.logo}
                className="w-12 h-10"
                style={{ tintColor: "#FFFFFF" }}
              />
            </View>
            <View className="my-5">
              <SearchBar
                placeHolder="Search movies..."
                value={searchQuery}
                onChangeText={(text: string) => setSearchQuery(text)}
                autoFocus={params.autoFocus === "true"}
              />
            </View>

            {loading && (
              <ActivityIndicator
                size="large"
                color="#6366f1"
                className="my-3"
              />
            )}

            {error && (
              <Text className="text-red-500 px-5 my-3">
                Error: {error.message}
              </Text>
            )}

            {!loading && !error && movies?.length > 0 && (
              <Text className="text-xl text-text font-bold">
                {searchQuery.trim() ? (
                  <>
                    Search Result for{" "}
                    <Text className="text-accent">{searchQuery}</Text>
                  </>
                ) : (
                  "Recommended Movies"
                )}
              </Text>
            )}
          </>
        }
        ListEmptyComponent={
          !loading && !error ? (
            <View className="mt-10 px-5">
              <Text className="text-center text-textMuted">
                No movies found
              </Text>
            </View>
          ) : null
        }
      />
    </View>
  );
};

export default Search;
