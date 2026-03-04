import { useGlobalContext } from "@/context/GlobalProvider";
import {
    avatars,
    getSavedMoviesFromAppwrite,
    logout,
} from "@/services/appwrite";
import { Ionicons } from "@expo/vector-icons";
import { router, useFocusEffect } from "expo-router";
import React, { useCallback, useState } from "react";
import {
    ActivityIndicator,
    Dimensions,
    FlatList,
    Image,
    ScrollView,
    Text,
    TouchableOpacity,
    View,
} from "react-native";

const Profile = () => {
  const { user, setUser, setIsLogged } = useGlobalContext();
  const { width: screenWidth } = Dimensions.get("window");

  const last12Months = Array.from({ length: 12 }).map((_, i) => {
    const d = new Date();
    d.setDate(1); // avoid edge cases like Feb 30th when subtracting months
    d.setMonth(d.getMonth() - i);
    return {
      key: `${d.getFullYear()}-${d.getMonth() + 1}`,
      label: d.toLocaleString("default", { month: "long", year: "numeric" }),
    };
  });

  const [stats, setStats] = useState({
    totalWatchTime: 0,
    monthlyWatchTime: {} as Record<string, number>,
    topGenres: [] as string[],
  });

  const [loading, setLoading] = useState(false);

  useFocusEffect(
    useCallback(() => {
      const fetchStats = async () => {
        if (!user?.$id) return;

        // only show the spinner on the very first load; after that, refresh silently in the background
        if (stats.totalWatchTime === 0) {
          setLoading(true);
        }

        try {
          // pull saved movies from Appwrite
          const moviesDict = await getSavedMoviesFromAppwrite(user.$id);
          const alreadyWatched = moviesDict["Already Watched"] || [];
          const allMovies = [
            ...(moviesDict["Want to Watch"] || []),
            ...alreadyWatched,
          ];

          // calculate total watch time and per-month breakdown (watched-only)
          let totalWatchTime = 0;
          const monthlyWatchTime: Record<string, number> = {};

          alreadyWatched.forEach((film) => {
            totalWatchTime += film.runtime || 0;

            if (film.$createdAt) {
              const date = new Date(film.$createdAt);
              const monthKey = `${date.getFullYear()}-${date.getMonth() + 1}`;
              monthlyWatchTime[monthKey] =
                (monthlyWatchTime[monthKey] || 0) + (film.runtime || 0);
            }
          });

          // count genre occurrences across all lists
          const genreCounts: Record<string, number> = {};
          allMovies.forEach((film) => {
            if (film.genres && Array.isArray(film.genres)) {
              film.genres.forEach((genre: any) => {
                const genreName = genre.name || genre;
                genreCounts[genreName] = (genreCounts[genreName] || 0) + 1;
              });
            }
          });

          // sort genres by how often they appear
          const sortedGenresArray = Object.entries(genreCounts)
            .sort((a, b) => b[1] - a[1])
            .map((entry) => entry[0]);

          // write back to state
          setStats({
            totalWatchTime: totalWatchTime,
            monthlyWatchTime: monthlyWatchTime,
            topGenres: sortedGenresArray,
          });
        } catch (error) {
        } finally {
          setLoading(false);
        }
      };
      fetchStats();
    }, [user?.$id]),
  );

  const formatTime = (minutes: number) => {
    if (!minutes) return "0h 0m";
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return `${hours}h ${mins}m`;
  };

  const handleLogout = async () => {
    await logout();
    setUser(null);
    setIsLogged(false);
    router.replace("/sign-in");
  };

  return (
    <ScrollView
      className="bg-background flex-1"
      contentContainerStyle={{ flexGrow: 1, paddingBottom: 120 }}
    >
      <View className="w-full justify-center items-center px-4 mt-20">
        <View className="w-24 h-24 border border-white/10 rounded-full justify-center items-center bg-surfaceLight">
          <Image
            source={{
              uri:
                user?.avatar &&
                typeof user.avatar === "string" &&
                user.avatar.startsWith("http")
                  ? user.avatar
                  : avatars.getInitialsURL(user?.username || "A").href,
            }}
            className="w-[95%] h-[95%] rounded-full"
            resizeMode="cover"
          />
        </View>

        <Text className="text-text text-2xl font-psemibold mt-5">
          {user?.username}
        </Text>

        <View className="w-full mt-10">
          <Text className="text-lg text-text font-psemibold mb-4">
            Your Statistics
          </Text>

          {loading ? (
            <ActivityIndicator size="large" color="#FF3D71" className="mt-4" />
          ) : (
            <View className="flex-col gap-4">
              {/* watch time cards */}
              <View className="flex-col gap-4 w-full">
                {/* total watch time */}
                <View className="w-full bg-surfaceLight border border-white/5 rounded-2xl p-6 items-center">
                  <Ionicons name="time-outline" size={32} color="#FF3D71" />
                  <Text className="text-text/70 text-base mt-2 font-pregular">
                    Total Time
                  </Text>
                  <Text className="text-text text-2xl font-psemibold mt-1">
                    {formatTime(stats.totalWatchTime)}
                  </Text>
                </View>

                {/* monthly breakdown — horizontal paging */}
                <View className="w-full bg-surfaceLight border border-white/5 rounded-2xl py-6 items-center overflow-hidden">
                  <FlatList
                    data={last12Months}
                    keyExtractor={(item) => item.key}
                    horizontal
                    pagingEnabled
                    showsHorizontalScrollIndicator={false}
                    getItemLayout={(_, index) => ({
                      length: screenWidth - 32,
                      offset: (screenWidth - 32) * index,
                      index,
                    })}
                    renderItem={({ item }) => (
                      <View
                        style={{ width: screenWidth - 32 }}
                        className="items-center px-4"
                      >
                        <Ionicons
                          name="calendar-outline"
                          size={32}
                          color="#00C896"
                        />
                        <Text className="text-text/70 text-base mt-2 font-pregular">
                          {item.label}
                        </Text>
                        <Text className="text-text text-2xl font-psemibold mt-1">
                          {formatTime(stats.monthlyWatchTime[item.key] || 0)}
                        </Text>
                      </View>
                    )}
                  />
                  {/* swipe hint */}
                  <View className="flex-row items-center mt-3 opacity-50">
                    <Ionicons name="chevron-back" size={16} color="#ffffff" />
                    <Text className="text-text/50 text-xs px-2 font-pregular">
                      Swipe months
                    </Text>
                    <Ionicons
                      name="chevron-forward"
                      size={16}
                      color="#ffffff"
                    />
                  </View>
                </View>
              </View>

              {/* top genres */}
              <View className="w-full bg-surfaceLight border border-white/5 rounded-2xl p-4 mt-2">
                <View className="flex-row items-center mb-3">
                  <Ionicons name="star-outline" size={24} color="#FFD700" />
                  <Text className="text-text font-psemibold text-base ml-2">
                    Top Genres
                  </Text>
                </View>

                {stats.topGenres.length > 0 ? (
                  <ScrollView
                    horizontal
                    showsHorizontalScrollIndicator={false}
                    contentContainerStyle={{ gap: 12, paddingHorizontal: 4 }}
                  >
                    {stats.topGenres.slice(0, 5).map((genre, index) => (
                      <TouchableOpacity
                        key={index}
                        onPress={() =>
                          router.push(
                            `/search?query=${encodeURIComponent(genre)}`,
                          )
                        }
                        className="bg-white/10 px-4 py-1.5 rounded-full border border-white/5 justify-center"
                      >
                        <Text className="text-text text-sm font-pregular whitespace-nowrap">
                          {index + 1}. {genre}
                        </Text>
                      </TouchableOpacity>
                    ))}
                  </ScrollView>
                ) : (
                  <Text className="text-text/50 font-pregular">
                    No genres watched yet.
                  </Text>
                )}
              </View>
            </View>
          )}
        </View>

        <TouchableOpacity onPress={handleLogout} className="w-full mt-10">
          <View className="w-full h-16 bg-surfaceLight border border-white/5 rounded-2xl justify-center items-center">
            <Text className="text-accent font-psemibold text-lg">Log Out</Text>
          </View>
        </TouchableOpacity>

        {/* extra bottom space so the logout button clears the tab bar */}
        <View className="w-full h-24 mb-12" />
      </View>
    </ScrollView>
  );
};

export default Profile;
