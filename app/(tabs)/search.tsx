import MovieCard from "@/components/MovieCard";
import SearchBar from "@/components/SearchBar";
import { icons } from "@/constants/icons";
import { fetchMovies } from "@/services/api";
import useFetch from "@/services/useFetch";
import { useLocalSearchParams } from "expo-router";
import React, { useEffect, useRef, useState } from "react";
import {
  ActivityIndicator,
  FlatList,
  Image,
  Keyboard,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

const Search = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const params = useLocalSearchParams<{ query?: string }>(); // Recuperiamo il timestamp
  const inputRef = useRef<TextInput>(null);

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
    if (params.query) {
      setSearchQuery("");

      // Wait strictly for the Tab transition to end, then focus imperatively
      const timer = setTimeout(() => {
        inputRef.current?.focus();
      }, 500);

      return () => {
        clearTimeout(timer);
        Keyboard.dismiss();
      };
    }
  }, [params.query]);

  return (
    <View className="flex-1 bg-background" style={{ paddingTop: 40 }}>
      <TouchableOpacity activeOpacity={1} onPress={Keyboard.dismiss}>
        <Image
          source={icons.logo}
          className="w-[115px] h-[35px] mt-10 mb-8 mx-auto"
          resizeMode="contain"
          style={{ tintColor: "#FFFFFF" }}
        />
      </TouchableOpacity>
      <View className="px-5 mb-5 w-full">
        <SearchBar
          ref={inputRef}
          placeHolder="Search movies..."
          value={searchQuery}
          onChangeText={(text: string) => setSearchQuery(text)}
        />
      </View>

      <FlatList
        keyboardShouldPersistTaps="handled"
        keyboardDismissMode="on-drag"
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
