import AnimatedAIBorder from "@/components/AnimatedAIBorder";
import MovieCard from "@/components/MovieCard";
import SearchBar from "@/components/SearchBar";
import { icons } from "@/constants/icons";
import { fetchAIRecommendations } from "@/services/ai";
import { fetchMovieByTitle, fetchMovies } from "@/services/api";
import {
  clearAiSearchHistory,
  clearSearchHistory,
  getAiSearchHistory,
  getSearchHistory,
  saveAiSearchQuery,
  saveSearchQuery,
} from "@/services/storage";
import { Ionicons } from "@expo/vector-icons";
import * as Haptics from "expo-haptics";
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
  movies: [] as Movie[],
  hasFetched: false,
  aiResult: null as {
    description: string;
    topMovie: Movie;
    otherMovies: Movie[];
  } | null,
};

export const clearSearchCache = () => {
  globalSearchCache = {
    query: "",
    movies: [] as Movie[],
    hasFetched: false,
    aiResult: null,
  };
};

const Search = () => {
  const [searchQuery, setSearchQuery] = useState(globalSearchCache.query);
  const [aiSearchQuery, setAiSearchQuery] = useState("");
  const [movies, setMovies] = useState<Movie[]>(globalSearchCache.movies);
  const [aiResult, setAiResult] = useState(globalSearchCache.aiResult);
  const [loading, setLoading] = useState(!globalSearchCache.hasFetched);
  const [isAiLoading, setIsAiLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const [page, setPage] = useState(1);
  const [loadingMore, setLoadingMore] = useState(false);
  const [hasMore, setHasMore] = useState(true);

  const [searchHistory, setSearchHistory] = useState<string[]>([]);
  const [aiSearchHistory, setAiSearchHistory] = useState<string[]>([]);
  const [showHistory, setShowHistory] = useState(false);

  const params = useLocalSearchParams<{ query?: string }>();
  const inputRef = useRef<TextInput>(null);

  const loadMovies = async (query: string, isInitial = true) => {
    if (isInitial) {
      setLoading(true);
      setPage(1);
      setHasMore(true);
      setAiResult(null);

      // Save to local async storage and state
      if (query.trim()) {
        await saveSearchQuery(query);
        const updated = await getSearchHistory();
        setSearchHistory(updated);
      }
    } else {
      setLoadingMore(true);
    }

    try {
      const currentPage = isInitial ? 1 : page;
      const results = await fetchMovies({ query, page: currentPage });

      if (results.length === 0) {
        setHasMore(false);
      } else {
        if (isInitial) {
          setMovies(results);
        } else {
          setMovies((prev) => [...prev, ...results]);
        }
        setPage((prev) => prev + 1);
      }

      if (isInitial) {
        globalSearchCache.query = query;
        globalSearchCache.movies = results;
        globalSearchCache.aiResult = null;
        globalSearchCache.hasFetched = true;
      }
    } catch (err: any) {
      setError(err);
    } finally {
      if (isInitial) setLoading(false);
      else setLoadingMore(false);
    }
  };

  const loadMoreMovies = () => {
    if (loading || loadingMore || !hasMore || isAiLoading || aiResult) return;
    loadMovies(searchQuery, false);
  };

  useEffect(() => {
    // load history from disk at startup
    const loadSearches = async () => {
      const normalHistory = await getSearchHistory();
      const aiHistory = await getAiSearchHistory();
      setSearchHistory(normalHistory);
      setAiSearchHistory(aiHistory);
    };
    loadSearches();
  }, []);

  // function to load movies using AI
  const loadAiMovies = async (query: string) => {
    if (!query.trim()) return;

    setIsAiLoading(true);
    setError(null);

    // Save AI query to local async storage and state
    await saveAiSearchQuery(query);
    const updatedAiHistory = await getAiSearchHistory();
    setAiSearchHistory(updatedAiHistory);

    try {
      const aiResponse = await fetchAIRecommendations(query);

      // We fetch ALL movie details (topMovie + the other 9) in parallel!
      // This is much faster than waiting for the topMovie to finish before starting the others.
      const searchPromises = [
        fetchMovieByTitle(aiResponse.topMovie),
        ...aiResponse.otherMovies.map((title: string) =>
          fetchMovieByTitle(title),
        ),
      ];

      // Wait for all fetches to finish at the same time
      const [topMovieResult, ...otherMoviesResults] =
        await Promise.all(searchPromises);

      const validOtherMovies = otherMoviesResults.filter(
        (m: Movie | null) => m !== null,
      ) as Movie[];

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

      loadMovies(searchQuery, true);
      return;
    }

    const timeoutId = setTimeout(async () => {
      await loadMovies(searchQuery, true);
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

      {/* NORMAL SearchBar Row */}
      <View className="px-5 mb-5 w-full flex-col gap-4">
        <View className="flex-row items-center w-full justify-between gap-x-2">
          <View className="flex-1">
            <SearchBar
              ref={inputRef}
              placeHolder="Search movies by title..."
              value={searchQuery}
              onChangeText={(text: string) => {
                setSearchQuery(text);
                if (text.length > 0) {
                  setAiSearchQuery("");
                  setAiResult(null);
                }
              }}
              onClear={() => setMovies([])}
            />
          </View>

          {/* External History Button */}
          <TouchableOpacity
            onPress={() => setShowHistory(!showHistory)}
            className="p-3 bg-surfaceLight rounded-full border border-white/5 items-center justify-center h-[52px] w-[52px]"
          >
            <Ionicons
              name="time-outline"
              size={24}
              color={showHistory ? "#34A853" : "#FFFFFF"}
            />
          </TouchableOpacity>
        </View>

        {/* AI SearchBar */}
        <AnimatedAIBorder>
          <View className="w-full">
            <SearchBar
              placeHolder="Describe a scene or vibe (AI) ✨..."
              value={aiSearchQuery}
              onChangeText={(text: string) => {
                setAiSearchQuery(text);
                if (text.length > 0) {
                  setSearchQuery("");
                  setMovies([]);
                }
              }}
              onSubmitEditing={() => {
                Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
                setShowHistory(false);
                loadAiMovies(aiSearchQuery);
              }}
              returnKeyType="search"
              onClear={() => setAiResult(null)}
            />
          </View>
        </AnimatedAIBorder>

        {/* Clear AI Results Button */}
        {aiResult && (
          <TouchableOpacity
            onPress={() => {
              Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
              setAiResult(null);
              setAiSearchQuery("");
              globalSearchCache.aiResult = null;
              globalSearchCache.query = "";
              loadMovies(searchQuery, true); // Reload normal results
            }}
            className="self-end bg-red-500/20 border border-red-500/50 px-4 py-2 rounded-full mt-2"
          >
            <Text className="text-red-400 font-bold text-sm">
              ✕ Clear AI Results
            </Text>
          </TouchableOpacity>
        )}

        {/* --- RECENT SEARCH HISTORY UI --- */}
        {showHistory && (
          <View className="mt-2 bg-surfaceLight/50 p-4 rounded-3xl border border-white/5 shadow-xl">
            {/* AI History */}
            {aiSearchHistory.length > 0 && (
              <View className="mb-6">
                <View className="flex-row justify-between items-center mb-3">
                  <Text className="text-white text-lg font-bold">
                    ✨ Recent AI Searches
                  </Text>
                  <TouchableOpacity
                    onPress={async () => {
                      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                      await clearAiSearchHistory();
                      setAiSearchHistory([]);
                    }}
                  >
                    <Text className="text-red-400 font-semibold text-sm">
                      Clear
                    </Text>
                  </TouchableOpacity>
                </View>

                <View className="flex-row flex-wrap gap-2">
                  {aiSearchHistory.map((item, index) => (
                    <TouchableOpacity
                      key={`ai-hist-${index}`}
                      className="bg-surfaceLight border border-white/10 rounded-full px-4 py-2"
                      onPress={() => {
                        setShowHistory(false);
                        setAiSearchQuery(item);
                        loadAiMovies(item);
                      }}
                    >
                      <Text
                        className="text-gray-300 text-sm"
                        numberOfLines={1}
                        ellipsizeMode="tail"
                        style={{ maxWidth: 200 }}
                      >
                        "{item}"
                      </Text>
                    </TouchableOpacity>
                  ))}
                </View>
              </View>
            )}

            {/* Normal History */}
            {searchHistory.length > 0 && (
              <View>
                <View className="flex-row justify-between items-center mb-3 mt-2">
                  <Text className="text-white text-lg font-bold">
                    Recent Titles
                  </Text>
                  <TouchableOpacity
                    onPress={async () => {
                      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                      await clearSearchHistory();
                      setSearchHistory([]);
                    }}
                  >
                    <Text className="text-red-400 font-semibold text-sm">
                      Clear
                    </Text>
                  </TouchableOpacity>
                </View>

                <View className="flex-col gap-y-2">
                  {searchHistory.map((item, index) => (
                    <TouchableOpacity
                      key={`norm-hist-${index}`}
                      className="flex-row items-center py-2"
                      onPress={() => {
                        setShowHistory(false);
                        setSearchQuery(item);
                        loadMovies(item);
                      }}
                    >
                      <Image
                        source={icons.search}
                        className="w-4 h-4 mr-3 opacity-50"
                        style={{ tintColor: "#FFFFFF" }}
                      />
                      <Text className="text-gray-300 text-base">{item}</Text>
                    </TouchableOpacity>
                  ))}
                </View>
              </View>
            )}
          </View>
        )}
      </View>

      <FlatList
        keyboardShouldPersistTaps="handled"
        keyboardDismissMode="on-drag"
        data={isAiLoading ? [] : movies}
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
              <View className="mb-8 w-full mt-2">
                <Text className="text-2xl text-[#34A853] font-bold mb-4">
                  ✨ Gemini is thinking...
                </Text>
                <View className="flex-row flex-wrap justify-start gap-[16px]">
                  {Array.from({ length: 9 }).map((_, index) => (
                    <View key={index} className="w-[30%] mb-4">
                      <View className="w-full h-52 bg-white/10 rounded-2xl" />
                      <View className="w-full h-4 bg-white/10 rounded mt-2" />
                      <View className="w-1/2 h-4 bg-white/10 rounded mt-2" />
                    </View>
                  ))}
                </View>
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
                    <View className="flex-row flex-wrap justify-start gap-[16px] mt-2">
                      {aiResult.otherMovies.map((item) => (
                        <MovieCard
                          key={item.id}
                          {...item}
                          className="w-[30%] mb-1"
                        />
                      ))}
                    </View>
                  </View>
                )}
              </View>
            )}

            {/* Hide the "Search Result for..." title when AI is loading too */}
            {!loading &&
              !error &&
              movies?.length > 0 &&
              !aiResult &&
              !isAiLoading && (
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
          !loading && !error && !aiResult && !isAiLoading ? (
            <View className="mt-10 px-5">
              <Text className="text-center text-textMuted">
                No movies found
              </Text>
            </View>
          ) : null
        }
        onEndReached={loadMoreMovies}
        onEndReachedThreshold={0.5}
        ListFooterComponent={
          loadingMore ? (
            <View className="py-4 justify-center items-center">
              <ActivityIndicator size="small" color="#6366f1" />
            </View>
          ) : (
            <View className="h-6" />
          )
        }
      />
    </View>
  );
};

export default Search;
