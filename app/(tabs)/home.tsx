import MovieCard from "@/components/MovieCard";
import SearchBar from "@/components/SearchBar";
import TrendingCard from "@/components/TrendingCard";
import { icons } from "@/constants/icons";
import { fetchMovies, fetchTrendingMovies } from "@/services/api";
import useFetch from "@/services/useFetch";
import { useRouter } from "expo-router";
import React, { useCallback, useEffect, useState } from "react";
import { ActivityIndicator, FlatList, Image, Text, View } from "react-native";

export default function Index() {
  const router = useRouter();

  const {
    data: trendingMovies,
    loading: trendingLoading,
    error: trendingError,
  } = useFetch(fetchTrendingMovies);

  const [movies, setMovies] = useState<any[]>([]);
  const [page, setPage] = useState(1);
  const [loadingTop, setLoadingTop] = useState(false);
  const [loadingMore, setLoadingMore] = useState(false);
  const [hasMore, setHasMore] = useState(true);

  const fetchMoviesBatch = async (startPage: number, isInitial: boolean) => {
    if (isInitial) setLoadingTop(true);
    else setLoadingMore(true);

    try {
      // batch-fetch 3 pages in parallel to get 60 movies at a time
      const [res1, res2, res3] = await Promise.all([
        fetchMovies({ query: "", page: startPage }),
        fetchMovies({ query: "", page: startPage + 1 }),
        fetchMovies({ query: "", page: startPage + 2 }),
      ]);
      const newMovies = [...res1, ...res2, ...res3];
      if (newMovies.length === 0) {
        setHasMore(false);
      } else {
        setMovies((prev) => [...prev, ...newMovies]);
      }
    } catch (err: any) {
    } finally {
      if (isInitial) setLoadingTop(false);
      else setLoadingMore(false);
    }
  };

  useEffect(() => {
    fetchMoviesBatch(1, true);
    setPage(4);
  }, []);

  const loadMore = useCallback(() => {
    if (loadingMore || loadingTop || !hasMore) return;
    fetchMoviesBatch(page, false);
    setPage((prev) => prev + 3);
  }, [page, loadingMore, loadingTop, hasMore]);

  const renderHeader = () => (
    <>
      <Image
        source={icons.logo}
        className="w-[115px] h-[35px] mt-10 mb-8 mx-auto"
        resizeMode="contain"
        style={{ tintColor: "#FFFFFF" }}
      />
      <View className="px-5 w-full">
        {trendingLoading && movies.length === 0 ? (
          <ActivityIndicator
            size="large"
            color="#6366f1"
            className="mt-10 self-center"
          />
        ) : trendingError ? (
          <Text className="text-textMuted">
            Errore: {trendingError?.message}
          </Text>
        ) : (
          <View className="flex-1">
            <SearchBar
              onPress={() =>
                router.push({
                  pathname: "/search",
                  params: { query: Date.now().toString() },
                })
              }
              placeHolder="Search For a movie"
              value=""
              onChangeText={() => {}}
            />

            {trendingMovies && trendingMovies.length > 0 && (
              <>
                <View className="mt-10">
                  <Text className="text-lg text-text font-bold mb-5 leading-none">
                    Trending Movies
                  </Text>
                </View>

                <FlatList
                  className="mb-6 mt-1"
                  horizontal
                  showsHorizontalScrollIndicator={false}
                  ItemSeparatorComponent={() => <View className="w-5" />}
                  data={trendingMovies}
                  renderItem={({ item, index }) => (
                    <TrendingCard movie={item} index={index} />
                  )}
                  keyExtractor={(item) => item.id.toString()}
                />
              </>
            )}

            <Text className="text-lg text-text font-bold mt-5 mb-5 leading-none">
              Latest Movies
            </Text>
            {loadingTop && (
              <ActivityIndicator
                size="small"
                color="#6366f1"
                className="mb-5"
              />
            )}
          </View>
        )}
      </View>
    </>
  );

  return (
    <View className="flex-1 bg-background">
      <FlatList
        data={movies}
        renderItem={({ item }) => <MovieCard {...item} />}
        keyExtractor={(item, index) => `${item.id}-${index}`}
        numColumns={3}
        columnWrapperStyle={{
          justifyContent: "flex-start",
          gap: 20,
          paddingRight: 20,
          paddingLeft: 20,
          marginBottom: 20,
        }}
        contentContainerStyle={{
          paddingBottom: 100, // keep content clear of the tab bar
          paddingTop: 40,
        }}
        ListHeaderComponent={renderHeader}
        onEndReached={loadMore}
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
}
