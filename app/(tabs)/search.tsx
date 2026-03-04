import MovieCard from "@/components/MovieCard";
import SearchBar from "@/components/SearchBar";
import { icons } from "@/constants/icons";
import { fetchMovies } from "@/services/api";
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

let globalSearchCache = {
  query: "",
  movies: [] as any[],
  hasFetched: false,
};

const Search = () => {
  const [searchQuery, setSearchQuery] = useState(globalSearchCache.query);
  const [movies, setMovies] = useState<any[]>(globalSearchCache.movies);
  const [loading, setLoading] = useState(!globalSearchCache.hasFetched);
  const [error, setError] = useState<Error | null>(null);

  const params = useLocalSearchParams<{ query?: string }>();
  const inputRef = useRef<TextInput>(null);

  const loadMovies = async (query: string) => {
    setLoading(true);
    try {
      const results = await fetchMovies({ query, page: 1 });
      setMovies(results);
      globalSearchCache.query = query;
      globalSearchCache.movies = results;
      globalSearchCache.hasFetched = true;
    } catch (err: any) {
      setError(err);
    } finally {
      setLoading(false);
    }
  };

  const isFirstMount = useRef(true);

  useEffect(() => {
    if (isFirstMount.current) {
      isFirstMount.current = false;
      // if we're coming back to this tab and the query hasn't changed, reuse the cached results
      if (
        globalSearchCache.hasFetched &&
        searchQuery === globalSearchCache.query
      ) {
        setLoading(false);
        return;
      }

      loadMovies(searchQuery);
      return;
    }

    const timeoutId = setTimeout(async () => {
      await loadMovies(searchQuery);
    }, 500);
    return () => clearTimeout(timeoutId);
  }, [searchQuery]);

  useEffect(() => {
    if (params.query) {
      setSearchQuery(params.query);

      // wait for the tab transition to finish before focusing the input
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
