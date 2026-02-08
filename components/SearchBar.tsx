import { Image, StyleSheet, Text, TextInput, View } from 'react-native'
import React from 'react'
import { icons } from "@/constants/icons";

// 1. INTERFACCIA TYPESCRIPT (Props)
// Qui definiamo il "contratto". Chi vuole usare questo componente DEVE rispettare queste regole.
interface Props {
    placeHolder: string;    // Obbligatorio: deve essere una stringa di testo.
    onPress?: () => void;   // Opzionale (c'è il ?): è una funzione che non restituisce nulla (void).
    value?: string;
    onChangeText?: (text: string) => void;
    autoFocus?: boolean;
}

// 2. DEFINIZIONE DEL COMPONENTE
// ({placeHolder, onPress} : Props) -> Qui stiamo "spacchettando" (destrutturando) i dati ricevuti.
const SearchBar = ({ placeHolder, onPress, value, onChangeText, autoFocus = false }: Props) => {
    return (
        // 3. CONTENITORE ESTERNO (La forma a pillola)
        // flex-row: Mette gli elementi (lente e input) uno accanto all'altro, non uno sotto l'altro.
        // items-center: (ATTENZIONE: avevi scritto 'itomes', corretto in 'items') Centra verticalmente gli oggetti.
        // bg-dark-200: Sfondo scuro della barra.
        // rounded-full: Arrotonda completamente i bordi.
        <View className="flex-row items-center bg-dark-200 rounded-full px-5 py-4">

            {/* 4. ICONA LENTE
            size-5: Imposta larghezza e altezza a 20px (unità Tailwind).
            resizeMode="contain": Assicura che l'icona non venga tagliata o deformata.
            tintColor: Colora l'icona via codice (utile per non rifare il PNG di un altro colore).
        */}
            <Image source={icons.search} className="size-5" resizeMode="contain" tintColor="#ab8bff" />

            {/* 5. CAMPO DI TESTO (Dove si scrive)
            flex-1: PRENDITI TUTTO LO SPAZIO RIMANENTE. Fondamentale per spingere il testo a occupare la larghezza.
            text-white: Il testo digitato sarà bianco.
            placeholderTextColor: Il colore della scritta "Search for a movie" quando il campo è vuoto.
        */}
            <TextInput
                onPress={onPress}        // Quando tocchi il campo, esegue l'azione passata dal genitore.</>
                placeholder={placeHolder} // Usa il testo passato dal genitore.
                value={value}                 // IMPORTANTE: Qui stai forzando il valore a essere sempre vuoto.
                // In questo caso specifico va bene perché la barra funge da "bottone" per cambiare pagina,
                // ma in una barra di ricerca reale, 'value' dovrebbe essere collegato a una variabile di stato.
                onChangeText={onChangeText}     // Funzione vuota (per ora non fa nulla quando scrivi).
                placeholderTextColor="#a8b5db"
                className="flex-1 ml-2 text-white" // ml-2: Margine a sinistra per staccarsi dalla lente.
                autoFocus={autoFocus}
            />
        </View>
    )
}

export default SearchBar