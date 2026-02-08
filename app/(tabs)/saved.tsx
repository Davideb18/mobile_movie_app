import { Image, ScrollView, StyleSheet, Text, View } from 'react-native'
import React from 'react'
import { icons } from "@/constants/icons";
import { images } from '@/constants/images';

const Saved = () => {
    return (
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

                <Text className="text-white text-3xl font-bold text-center mt-5">SAVED FILE</Text>
            </ScrollView>
        </View>
    )
}

export default Saved
