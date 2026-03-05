import AnimatedAIBorder from "@/components/AnimatedAIBorder";
import MovieCard from "@/components/MovieCard";
import SearchBar from "@/components/SearchBar";
import { icons } from "@/constants/icons";
import { fetchAIRecommendations } from "@/services/ai";
import { fetchMovieByTitle, fetchMovies } from "@/services/api";
import { Link, useLocalSearchParams } from "expo-router";
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
  aiResult: null as {
    description: string;
    topMovie: any;
    otherMovies: any[];
  } | null,
};

const Search = () => {
  const [searchQuery, setSearchQuery] = useState(globalSearchCache.query);
  const [aiSearchQuery, setAiSearchQuery] = useState("");
  const [movies, setMovies] = useState<any[]>(globalSearchCache.movies);
  const [aiResult, setAiResult] = useState(globalSearchCache.aiResult);
  const [loading, setLoading] = useState(!globalSearchCache.hasFetched);
  const [isAiLoading, setIsAiLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const params = useLocalSearchParams<{ query?: string }>();
  const inputRef = useRef<TextInput>(null);

  const loadMovies = async (query: string) => {
    setLoading(true);
    setAiResult(null);
    try {
      const results = await fetchMovies({ query, page: 1 });
      setMovies(results);
      globalSearchCache.query = query;
      globalSearchCache.movies = results;
      globalSearchCache.aiResult = null;
      globalSearchCache.hasFetched = true;
    } catch (err: any) {
      setError(err);
    } finally {
      setLoading(false);
    }
  };

  // function to load movies using AI
  const loadAiMovies = async (query: string) => {
    if (!query.trim()) return;

    setIsAiLoading(true);
    setError(null);
    try {
      const aiResponse = await fetchAIRecommendations(query);

      // Fetch TMDB details for the top movie
      const topMovieResult = await fetchMovieByTitle(aiResponse.topMovie);

      // Fetch details for other movies
      const otherMoviesPromises = aiResponse.otherMovies.map((title: string) =>
        fetchMovieByTitle(title),
      );
      const otherMoviesResults = await Promise.all(otherMoviesPromises);
      const validOtherMovies = otherMoviesResults.filter(
        (m: any) => m !== null,
      );

      if (topMovieResult) {
        const newAiResult = {
          description: aiResponse.description,
          topMovie: topMovieResult,
          otherMovies: validOtherMovies,
        };

        setAiResult(newAiResult);
        setMovies([]); // Clear standard search results

        globalSearchCache.query = query;
        globalSearchCache.movies = [];
        globalSearchCache.aiResult = newAiResult;
        globalSearchCache.hasFetched = true;
      } else {
        throw new Error("Could not find the recommended top movie on TMDB.");
      }
    } catch (err: any) {
      setError(err);
    } finally {
      setIsAiLoading(false);
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

      {/* NORMAL SearchBar */}
      <View className="px-5 mb-5 w-full flex-col gap-4">
        <SearchBar
          ref={inputRef}
          placeHolder="Search movies by title..."
          value={searchQuery}
          onChangeText={(text: string) => setSearchQuery(text)}
        />

        {/* AI SearchBar */}
        <AnimatedAIBorder>
          <View className="w-full">
            <SearchBar
              placeHolder="Describe a scene or vibe (AI) ✨..."
              value={aiSearchQuery}
              onChangeText={(text: string) => setAiSearchQuery(text)}
              onSubmitEditing={() => {
                loadAiMovies(aiSearchQuery);
              }}
              multiline={true}
            />
          </View>
        </AnimatedAIBorder>
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
            {loading && !isAiLoading && (
              <ActivityIndicator
                size="large"
                color="#6366f1"
                className="my-3"
              />
            )}

            {isAiLoading && (
              <View className="flex flex-col items-center my-5">
                <ActivityIndicator size="large" color="#34A853" />
                <Text className="text-[#34A853] mt-2 font-medium">
                  ✨ AI is finding movies...
                </Text>
              </View>
            )}

            {error && (
              <Text className="text-red-500 px-5 my-3">
                Error: {error.message}
              </Text>
            )}

            {/* AI Result Section */}
            {!loading && !isAiLoading && !error && aiResult && (
              <View className="mb-8">
                <Text className="text-2xl text-white font-bold mb-4">
                  ✨ AI Top Pick
                </Text>

                <Link href={`/movies/${aiResult.topMovie.id}`} asChild>
                  <TouchableOpacity
                    activeOpacity={0.85}
                    className="bg-surfaceLight rounded-3xl p-4 border border-white/10 mb-4"
                  >
                    <Image
                      source={{
                        uri: aiResult.topMovie.poster_path
                          ? `https://image.tmdb.org/t/p/w500${aiResult.topMovie.poster_path}`
                          : "https://via.placeholder.com/500x750.png?text=No+Poster",
                      }}
                      className="w-full h-96 rounded-2xl mb-4"
                      resizeMode="cover"
                    />
                    <Text className="text-white text-2xl font-bold mb-2">
                      {aiResult.topMovie.title}
                    </Text>

                    {/* AI Description */}
                    <View className="bg-[#2C2C38] rounded-xl p-4 border-l-4 border-slate-400">
                      <Text className="text-gray-300 text-base leading-6 italic">
                        "{aiResult.description}"
                      </Text>
                    </View>
                  </TouchableOpacity>
                </Link>

                {aiResult.otherMovies.length > 0 && (
                  <View>
                    <Text className="text-xl text-white font-semibold mb-3">
                      Also Consider
                    </Text>
                    <FlatList
                      data={aiResult.otherMovies}
                      renderItem={({ item }) => (
                        <View style={{ width: 130, marginRight: 16 }}>
                          <MovieCard {...item} className="w-full" />
                        </View>
                      )}
                      keyExtractor={(item) => item.id.toString()}
                      horizontal
                      showsHorizontalScrollIndicator={false}
                      contentContainerStyle={{ paddingRight: 20 }}
                    />
                  </View>
                )}
              </View>
            )}

            {!loading && !error && movies?.length > 0 && !aiResult && (
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
          !loading && !error && !aiResult ? (
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
