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
  Image,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

const Profile = () => {
  const { user, setUser, setIsLogged } = useGlobalContext();

  const [stats, setStats] = useState({
    totalWatchTime: 0,
    monthlyWatchTime: {} as Record<string, number>,
    topGenres: [] as string[],
  });

  const [loading, setLoading] = useState(false);

  useFocusEffect(
    useCallback(() => {
      // 1. Definiamo la funzione asincrona che farà il lavoro sporco
      const fetchStats = async () => {
        if (!user?.$id) return; // Se l'utente non c'è, spegni il motore

        setLoading(true); // Accendiamo la rotellina di caricamento

        try {
          // 1. Recuperiamo i dati da Appwrite
          const moviesDict = await getSavedMoviesFromAppwrite(user.$id);
          const alreadyWatched = moviesDict["Already Watched"] || [];
          const allMovies = [
            ...(moviesDict["Want to Watch"] || []),
            ...alreadyWatched,
          ];

          // 2. Calcoliamo il tempo totale di visione (solo film già visti)
          const totalWatchTime = alreadyWatched.reduce((sum, film) => {
            return sum + (film.runtime || 0);
          }, 0);

          // 3. Calcoliamo i generi preferiti
          const genreCounts: Record<string, number> = {};
          allMovies.forEach((film) => {
            if (film.genres && Array.isArray(film.genres)) {
              film.genres.forEach((genre: any) => {
                const genreName = genre.name || genre;
                genreCounts[genreName] = (genreCounts[genreName] || 0) + 1;
              });
            }
          });

          // 4. Ordiniamo i generi per frequenza
          const sortedGenresArray = Object.entries(genreCounts)
            .sort((a, b) => b[1] - a[1]) // ordina per conteggio decrescente
            .map((entry) => entry[0]); // prendiamo solo il nome del genere

          // 5. Aggiorniamo lo stato con i dati calcolati
          setStats({
            totalWatchTime: totalWatchTime,
            monthlyWatchTime: {} as Record<string, number>,
            topGenres: sortedGenresArray,
          });
        } catch (error) {
          console.log("Errore nel calcolo delle statistiche:", error);
        } finally {
          setLoading(false); // Qualsiasi cosa succeda, spegniamo la rotellina
        }
      };
      // 2. Facciamo partire la funzione che abbiamo appena definito
      fetchStats();
    }, [user?.$id]), // Il motore si ricrea solo se cambia l'ID dell'utente
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

  console.log("Dati utente completo:", JSON.stringify(user, null, 2));
  return (
    <ScrollView
      className="bg-background flex-1"
      contentContainerStyle={{ flexGrow: 1, paddingBottom: 40 }}
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
              {/* Le due Card Alte in Riga affiancate */}
              <View className="flex-row justify-between gap-4">
                {/* 1. Prima Scheda (Sinistra): Tempo Totale */}
                <View className="flex-1 bg-surfaceLight border border-white/5 rounded-2xl p-4 items-center">
                  <Ionicons name="time-outline" size={28} color="#FF3D71" />
                  <Text className="text-text/70 text-sm mt-2 font-pregular">
                    Total Time
                  </Text>

                  {/* ECCO LA MAGIA: Pesca dallo stato e formatta */}
                  <Text className="text-text text-lg font-psemibold mt-1">
                    {formatTime(stats.totalWatchTime)}
                  </Text>
                </View>

                {/* 2. Seconda Scheda (Destra): Tempo del Mese in corso */}
                <View className="flex-1 bg-surfaceLight border border-white/5 rounded-2xl p-4 items-center">
                  <Ionicons name="calendar-outline" size={28} color="#00C896" />
                  <Text className="text-text/70 text-sm mt-2 font-pregular">
                    This Month
                  </Text>

                  {/* SECONDA MAGIA: */}
                  <Text className="text-text text-lg font-psemibold mt-1">
                    {formatTime(
                      stats.monthlyWatchTime[
                        `${new Date().getFullYear()}-${new Date().getMonth() + 1}`
                      ] || 0,
                    )}

                    {/* Box dei Generi Top */}
                    <View className="bg-surfaceLight border border-white/5 rounded-2xl p-4 mt-2">
                      <View className="flex-row items-center mb-3">
                        <Ionicons
                          name="star-outline"
                          size={24}
                          color="#FFD700"
                        />
                        <Text className="text-text font-psemibold text-base ml-2">
                          Top Genres
                        </Text>
                      </View>

                      {/* JSX CONDIZIONALE: Se l'array ha elementi, usa il .map per disegnarne uno a caso, sennò mostra testo */}
                      {stats.topGenres.length > 0 ? (
                        <View className="flex-row flex-wrap gap-2">
                          {/* .map() funziona come il forEach, ma in JSX dice: "Per ogni genere, disegna un View" */}
                          {stats.topGenres.map((genre, index) => (
                            <View
                              key={index}
                              className="bg-white/10 px-3 py-1 rounded-full"
                            >
                              <Text className="text-text text-sm font-pregular">
                                {index + 1}. {genre}
                              </Text>
                            </View>
                          ))}
                        </View>
                      ) : (
                        <Text className="text-text/50 font-pregular">
                          No genres watched yet.
                        </Text>
                      )}
                    </View>
                  </Text>
                </View>
              </View>
            </View>
          )}
        </View>

        <TouchableOpacity onPress={handleLogout} className="w-full mt-10">
          <View className="w-full h-16 bg-surfaceLight border border-white/5 rounded-2xl justify-center items-center">
            <Text className="text-accent font-psemibold text-lg">Log Out</Text>
          </View>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
};

export default Profile;
