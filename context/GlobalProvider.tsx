import { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { getCurrentUser } from "../services/appwrite";
import { ActivityIndicator, View } from "react-native";

// definition of what the context will contain
const GlobalContext = createContext<any>(null);


// 2. Creiamo il "gancio" (Hook)
// Le altre pagine useranno QUESTO comando per leggere i dati.
// Invece di scrivere ogni volta `useContext(GlobalContext)`, scriveranno solo `useGlobalContext()`.
// È una scorciatoia comodissima.
export const useGlobalContext = () => useContext(GlobalContext);

export const GlobalProvider = ({
    children }: {
        children: ReactNode
    }) => {

    // 1. MEMORY STATE
    // isLogged: L'interruttore. false = siamo fuori, true = siamo dentro.
    const [isLogged, setIsLogged] = useState(false);

    // user: Il fascicolo. Contiene i dati. All'inizio è vuoto (null).
    const [user, setUser] = useState<any>(null);

    // loading: Il semaforo. true = ALT, stiamo lavorando.
    const [loading, setLoading] = useState(true);

    // --- 2. L'AUTOMATISMO (Effect) ---
    // Questo codice parte AUTOMATICAMENTE una volta sola all'avvio.
    // La sintassi è: useEffect( funzione_da_eseguire, [ quando_eseguirla ] )
    useEffect(() => {
        getCurrentUser() // richiamo la funzione in appwrite per capire se c'é qualcuno
            .then((res) => {    // .then = "Quando hai finito e hai una risposta (res)..."

                if (res) {        // SE c'è un risultato (res), vuol dire che l'utente è loggato.
                    setIsLogged(true); // accendo il login (non deve farlo)
                    setUser(res);      // inserisco i dati dentro user

                } else {  // ALTRIMENTI (res è null), nessuno è loggato.
                    setIsLogged(false);
                    setUser(res);
                }

            })
            .catch((error) => {
                console.log(error);
            })

            // .finally = "Alla fine di tutto, che sia andata bene o male..."
            .finally(() => {
                setLoading(false);  // Spegni il semaforo. Possiamo mostrare l'app.
            })
    }, []);
    // Le quadre vuote [] sono fondamentali: dicono "Fallo SOLO la prima volta".

    // --- 3. LA CONFEZIONE (Render) ---
    return (
        <GlobalContext.Provider value={{
            // 'value' è il contenuto della Bacheca visibile a tutti.
            isLogged,
            setIsLogged,
            user,
            setUser,
            loading,
        }}
        >
            {loading ? (
                // Mostra la rotellina mentre carica
                <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#161622' }}>
                    <ActivityIndicator size="large" color="#FF9C01" />
                </View>
            ) : (
                children
            )}
        </GlobalContext.Provider>
    );

};