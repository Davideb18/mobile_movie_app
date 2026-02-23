import { icons } from "@/constants/icons";
import { useSavedMovies } from "@/context/SavedMoviesContext";
import { Link } from "expo-router";
import React from "react";
import {
  FlatList,
  Image,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

const Saved = () => {
  const { savedMovies } = useSavedMovies();

  const categories = Object.keys(savedMovies);
  return (
    <View className="flex-1 bg-background">
      <ScrollView
        className="flex-1 px-5"
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

        <Text className="text-2xl text-text font-psemibold text-center mt-5 mb-4">
          Saved Collections
        </Text>

        <View className="mt-10">
          {categories.map((category) => (
            <View key={category} className="mb-8">
              <Text className="text-white text-xl font-bold mb-4">
                {category}
              </Text>

              <FlatList
                data={savedMovies[category]}
                horizontal={true}
                showsHorizontalScrollIndicator={false}
                ListEmptyComponent={() => (
                  <View className="bg-slate-200/20 border border-white/5 rounded-2xl p-4 justify-center items-center">
                    <Text className="text-textMuted text-sm italic text-center">
                      No movies saved in this list yet.
                    </Text>
                  </View>
                )}
                keyExtractor={(item) => item.id.toString()}
                renderItem={({ item }) => (
                  <Link href={`/movies/${item.id}`} asChild>
                    <TouchableOpacity className="mr-5 w-36">
                      <Image
                        source={{
                          uri: item.poster_path
                            ? `https://image.tmdb.org/t/p/w500${item.poster_path}`
                            : "https://placehold.co/600x400/1a1a1a/ffffff.png",
                        }}
                        className="w-full h-52 rounded-2xl"
                        resizeMode="cover"
                      />
                      <Text
                        className="text-sm font-bold text-text mt-2 text-left"
                        numberOfLines={1}
                      >
                        {item.title}
                      </Text>
                    </TouchableOpacity>
                  </Link>
                )}
              />
            </View>
          ))}
        </View>
      </ScrollView>
    </View>
  );
};

export default Saved;
