import React from 'react'
import { Tabs } from "expo-router"
import { icons } from "@/constants/icons";
import { images } from "@/constants/images";
import { Image, Text, View, ImageBackground } from "react-native";

/**
 * TabIcon: Componente personalizzato per le icone della barra di navigazione.
 * Gestisce l'aspetto visivo in base allo stato 'focused' (se la tab è attiva o meno).
 */
const TabIcon = ({ focused, icon, title }: any) => {

    // --- STATO ATTIVO (Tab selezionata) ---
    if (focused) {
        return (
            <ImageBackground
                source={images.highlight} // Immagine di sfondo (effetto evidenziatore)
                className="flex flex-row w-full flex-1 min-w-[112px] min-h-16 mt-4 justify-center items-center rounded-full overflow-hidden"
            >
                {/* Icona della tab (es. Home, Search...) */}
                <Image source={icon} tintColor="#151312" className="size-5" />

                {/* Il titolo viene mostrato SOLO se la tab è attiva */}
                <Text className="text-secondary text-base font-semibold ml-2">
                    {title}
                </Text>
            </ImageBackground>
        )
    }

    // --- STATO INATTIVO (Tab non selezionata) ---
    return (
        <View className="size-full justify-center items-center mt-4 rounded-full">
            {/* Se non è attiva, mostriamo solo l'icona in grigio/blu (#A8B5DB) per pulizia visiva */}
            <Image source={icon} tintColor="#A8B5DB" className="size-5" />
        </View>
    )
}

const _Layout = () => {
    return (
        <Tabs
            screenOptions={{
                // Nascondiamo la label di default di Expo perché usiamo la nostra custom in TabIcon
                tabBarShowLabel: false,

                // Stile per centrare il contenuto di ogni tab
                tabBarItemStyle: {
                    width: '100%',
                    height: '100%',
                    justifyContent: 'center',
                    alignItems: 'center',
                },

                // Stile della barra di navigazione (Floating Bar)
                tabBarStyle: {
                    backgroundColor: '#0f0D23', // Colore scuro di sfondo
                    borderRadius: 50,          // Bordi molto arrotondati
                    marginHorizontal: 20,      // Margine laterale per staccarla dai bordi
                    marginBottom: 36,          // Margine inferiore per staccarla dal fondo (effetto floating)
                    height: 52,                // Altezza fissa
                    position: 'absolute',      // Posizione assoluta per sovrapporsi al contenuto
                    overflow: 'hidden',        // Maschera il contenuto che esce dai bordi
                    borderWidth: 1,            // Bordo sottile
                    borderColor: '#0f0D23',
                },
            }}
        >
            {/* --- TAB HOME --- */}
            <Tabs.Screen
                name="home"
                options={{
                    title: 'Home',
                    headerShown: false, // Nasconde l'header in alto
                    tabBarIcon: ({ focused }) => ( // focused e il valore che viene passato
                        // quando si preme sulla Barra esso può essere TRUE o FALSE in base a quale tasto premiamo ed è l'unico valore
                        // che serve preso dall'input
                        // Se non scrivi { focused } dentro le parentesi, stai semplicemente dicendo:
                        // "Non mi interessa sapere in che stato si trova il bottone, io disegno l'icona sempre allo stesso modo".
                        <TabIcon
                            focused={focused}
                            icon={icons.home}
                            title="Home"
                        />
                    )
                }}
            />

            {/* --- TAB SEARCH --- */}
            <Tabs.Screen
                name="search"
                options={{
                    title: 'Search',
                    headerShown: false,
                    tabBarIcon: ({ focused }) => (
                        <TabIcon
                            focused={focused}
                            icon={icons.search}
                            title="Search"
                        />
                    )
                }}
            />

            {/* --- TAB SAVED --- */}
            <Tabs.Screen
                name="saved"
                options={{
                    title: 'Saved',
                    headerShown: false,
                    tabBarIcon: ({ focused }) => (
                        <TabIcon
                            focused={focused}
                            icon={icons.save}
                            title="Saved"
                        />
                    )
                }}
            />

            {/* --- TAB PROFILE --- */}
            <Tabs.Screen
                name="profile"
                options={{
                    title: 'Profile',
                    headerShown: false,
                    tabBarIcon: ({ focused }) => (
                        <TabIcon
                            focused={focused}
                            icon={icons.person}
                            title="Profile"
                        />
                    )
                }}
            />
        </Tabs>
    )
}

export default _Layout