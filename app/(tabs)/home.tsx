import MovieCard from "@/components/MovieCard";
import SearchBar from "@/components/SearchBar";
import TrendingCard from "@/components/TrendingCard";
import { icons } from "@/constants/icons";
import { fetchMovies, fetchTrendingMovies } from "@/services/api";
import useFetch from "@/services/useFetch";
import { useRouter } from "expo-router";
import {
    ActivityIndicator,
    FlatList,
    Image,
    ScrollView,
    Text,
    View,
} from "react-native";

export default function Index() {
  const router = useRouter();

  const {
    data: trendingMovies,
    loading: trendingLoading,
    error: trendingError,
  } = useFetch(fetchTrendingMovies);

  const {
    data: movies,
    loading: moviesLoading,
    error: moviesErrore,
  } = useFetch(() =>
    fetchMovies({
      query: "",
    }),
  );

  return (
    <View className="flex-1 bg-background">
      <ScrollView
        className="flex-1"
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{
          minHeight: "100%",
          paddingBottom: 10,
          paddingTop: 40,
        }}
      >
        <Image
          source={icons.logo}
          className="w-[115px] h-[35px] mt-10 mb-8 mx-auto"
          resizeMode="contain"
          style={{ tintColor: "#FFFFFF" }}
        />

        <View className="px-5 w-full">
          {moviesLoading || trendingLoading ? (
            <ActivityIndicator
              size="large"
              color="#6366f1"
              className="mt-10 self-center"
            />
          ) : moviesErrore || trendingError ? (
            <Text className="text-textMuted">
              Errore: {moviesErrore?.message || trendingError?.message}
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

              {trendingMovies && (
                <View className="mt-10">
                  <Text className="text-lg text-text font-bold mb-5 leading-none">
                    Trending Movies
                  </Text>
                </View>
              )}

              <>
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

                <Text className="text-lg text-text font-bold mt-5 mb-5 leading-none">
                  Latest Movies
                </Text>

                <FlatList
                  data={movies}
                  renderItem={({ item }) => <MovieCard {...item} />}
                  keyExtractor={(item) => item.id.toString()}
                  numColumns={3}
                  columnWrapperStyle={{
                    justifyContent: "flex-start",
                    gap: 20,
                    paddingRight: 5,
                    marginBottom: 20,
                  }}
                  className="mt-2 pb-32"
                  scrollEnabled={false}
                />
              </>
            </View>
          )}
        </View>
      </ScrollView>
    </View>
  );
}
