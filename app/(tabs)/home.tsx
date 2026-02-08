import { ActivityIndicator, FlatList, Image, ScrollView, Text, View } from "react-native";
// Importiamo le costanti (immagini e icone) per mantenere il codice pulito
// e non avere percorsi lunghi come '../../assets/images/...' sparsi ovunque.
import { images } from "@/constants/images";
import { icons } from "@/constants/icons";

// Importiamo il componente SearchBar che hai creato tu (il File SearchBar.tsx)
import SearchBar from "@/components/SearchBar";

// Importiamo l'hook per la navigazione di Expo Router
import { useRouter } from "expo-router";
import useFetch from "@/services/useFetch";
import { fetchMovies } from "@/services/api";
import MovieCard from "@/components/MovieCard";
import { getTrendingMovies } from "@/services/appwrite";
import TrendingCard from "@/components/TrendingCard";

export default function Index() {
    // 1. INIZIALIZZAZIONE HOOKS
    // 'router' è come un telecomando. Ci serve per dire all'app "cambia pagina".
    const router = useRouter();

    const {
        data: trendingMovies,
        loading: trendingLoading,
        error: trendingError
    } = useFetch(getTrendingMovies);

    const {
        data: movies,
        loading: moviesLoading,
        error: moviesErrore } = useFetch(() => fetchMovies({
            query: ''
        }));

    return (
        // 2. CONTENITORE PRINCIPALE
        // flex-1: Occupa tutto lo schermo disponibile.
        // bg-primary: Usa il colore primario definito nel tuo tailwind.config.js.
        <View className="flex-1 bg-primary">

            {/* 3. SFONDO (Background)
               absolute: Lo stacca dal flusso normale, così gli altri elementi ci passano sopra.
               w-full: Largo quanto lo schermo.
               z-0: Livello di profondità 0 (sta sotto a tutto, come un pavimento).
           */}
            <Image source={images.bg} className="absolute w-full z-0" />

            {/* 4. AREA SCORRIBILE (ScrollView)
               px-5: Padding orizzontale (lascia spazio a destra e sinistra).
               showsVerticalScrollIndicator={false}: Nasconde la barra di scorrimento laterale (più elegante).
               contentContainerStyle: Stile speciale per il contenuto interno dello scroll.
               minHeight: "100%": Assicura che si possa scorrere anche se c'è poco contenuto.
           */}
            <ScrollView className="flex-1 px-5" showsVerticalScrollIndicator={false}
                contentContainerStyle={{ minHeight: "100%", paddingBottom: 10 }}>

                {/* 5. LOGO
                   w-12 h-10: Larghezza e altezza fisse.
                   mt-20: Margine superiore abbondante (spinge il logo in basso).
                   mb-5: Margine inferiore (stacca la barra di ricerca).
                   mx-auto: "Margin X Auto", serve a centrare orizzontalmente l'elemento.
               */}
                <Image source={icons.logo} className="w-12 h-10 mt-20 mb-5 mx-auto" />
                {moviesLoading || trendingLoading ? (
                    <ActivityIndicator
                        size="large"
                        color="#0000ff"
                        className="mt-10 self-center"
                    />
                ) : moviesErrore || trendingError ? (
                    <Text>Errore:  {moviesErrore?.message || trendingError?.message}</Text>
                ) : (
                    <View className="flex-1 mt-5">
                        {/* Qui usiamo il TUO componente personalizzato.
                       Gli passiamo due "Props" (proprietà):
                       1. onPress: Una funzione che dice "quando clicchi, vai alla pagina /search".
                       2. placeHolder: Il testo grigio da mostrare.
                   */}
                        <SearchBar
                            onPress={() => router.push({ pathname: "/search", params: { autoFocus: "true" } })}
                            placeHolder="Search For a movie"
                            value=""
                            onChangeText={() => { }}
                        />

                        {trendingMovies && (
                            <View className="mt-10">
                                <Text className="text-lg text-white font-bold mb-3">Trending Movies</Text>
                            </View>
                        )}

                        <>
                            <FlatList className="mb-4 mt-3"
                                horizontal
                                showsHorizontalScrollIndicator={false}
                                ItemSeparatorComponent={() => <View className="w-4" />}
                                data={trendingMovies}
                                renderItem={({ item, index }) => (
                                    <TrendingCard movie={item} index={index} />
                                )}
                                keyExtractor={(item) => item.movie_id.toString()}
                            />

                            <Text className="text-lg text-white font-bold mt-5 mb-3">Latest Movies</Text>

                            <FlatList
                                data={movies}
                                renderItem={({ item }) => (
                                    <MovieCard
                                        {...item}
                                    />
                                )}
                                keyExtractor={(item) => item.id.toString()}
                                numColumns={3}
                                columnWrapperStyle={{
                                    justifyContent: 'flex-start',
                                    gap: 20,
                                    paddingRight: 5,
                                    marginBottom: 10
                                }}
                                className="mt-2 pb-32"
                                scrollEnabled={false}
                            />
                        </>
                    </View>
                )
                }

                {/* 6. CONTENITORE BARRA DI RICERCA */}

            </ScrollView>
        </View>
    );
}