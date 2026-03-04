import {
    createContext,
    ReactNode,
    useContext,
    useEffect,
    useState,
} from "react";
import { ActivityIndicator, View } from "react-native";
import { getCurrentUser } from "../services/appwrite";

const GlobalContext = createContext<any>(null);

// shortcut hook so other pages don't have to import useContext + GlobalContext every time
export const useGlobalContext = () => useContext(GlobalContext);

export const GlobalProvider = ({ children }: { children: ReactNode }) => {
  const [isLogged, setIsLogged] = useState(false);
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  // runs once on mount to restore the session if one already exists
  useEffect(() => {
    getCurrentUser()
      .then((res) => {
        if (res) {
          setIsLogged(true);
          setUser(res);
        } else {
          setIsLogged(false);
          setUser(res);
        }
      })
      .catch((error) => {
        console.error(error);
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);

  return (
    <GlobalContext.Provider
      value={{
        isLogged,
        setIsLogged,
        user,
        setUser,
        loading,
      }}
    >
      {loading ? (
        // show a spinner while the session check is in progress
        <View
          style={{
            flex: 1,
            justifyContent: "center",
            alignItems: "center",
            backgroundColor: "#161622",
          }}
        >
          <ActivityIndicator size="large" color="#FF9C01" />
        </View>
      ) : (
        children
      )}
    </GlobalContext.Provider>
  );
};
