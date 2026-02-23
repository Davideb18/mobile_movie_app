import {
  createContext,
  ReactNode,
  useContext,
  useEffect,
  useState,
} from "react";
import {
  getSavedMoviesFromAppwrite,
  removeMovieFromAppwrite,
  savemovieToAppwrite,
} from "../services/appwrite";
import { useGlobalContext } from "./GlobalProvider";

interface SavedMoviesContextType {
  savedMovies: Record<string, any[]>;

  saveMovie: (movie: any, category: string) => void;

  removeMovie: (movieId: number, category: string) => void;
}

export const SavedMoviesContext = createContext<SavedMoviesContextType | null>(
  null,
);

export const useSavedMovies = () => {
  const context = useContext(SavedMoviesContext);
  if (!context) {
    throw new Error(
      "useSavedMovies deve essere usato dentro a un SavedMoviesProvider",
    );
  }
  return context;
};

interface SavedMoviesProviderProps {
  children: ReactNode;
}

export const SavedMoviesProvider = ({ children }: SavedMoviesProviderProps) => {
  const [savedMovies, setSavedMovies] = useState<Record<string, any[]>>({
    "Want to Watch": [],
    "Already Watched": [],
  });

  const { user } = useGlobalContext();

  useEffect(() => {
    if (!user) return;

    const fetchMovies = async () => {
      try {
        const moviesFromCloud = await getSavedMoviesFromAppwrite(user.$id);

        setSavedMovies(moviesFromCloud);
      } catch (error) {
        console.log("Error fetching movies on load:", error);
      }
    };
    fetchMovies();
  }, [user]);

  // saveMovie
  const saveMovie = async (movie: any, category: string) => {
    // setSavedMovies are a function that take a callback function as an argument
    // this callback function take the previous state as an argument
    // prev is the dectionary of saved movies
    setSavedMovies((prev) => {
      // get the current category list
      const currentCategoryList = prev[category] || [];
      // check if the movie is already saved
      const isAldreadySaved = currentCategoryList.some(
        (m) => m.id === movie.id,
      );

      if (isAldreadySaved) {
        console.log(`Il film ${movie.title} è già in ${category}`);
        return prev;
      }
      return {
        ...prev, // keep the category that are not modified equal to the previous state
        [category]: [movie, ...currentCategoryList], // update the category adding the new movie and after the existing movies
      };
    });

    // save to appwrite
    if (user) {
      try {
        await savemovieToAppwrite(user.$id, movie, category);
        console.log(`Movie successfully saved to Appwrite in ${category}!`);
      } catch (error) {
        console.log("Error saving movie to Appwrite:", error);
      }
    }
  };

  // removeMovie
  const removeMovie = async (movieId: number, category: string) => {
    setSavedMovies((prev) => {
      // get the current category list
      const currentCategoryList = prev[category] || [];
      // remove the movie from the category list
      const updateList = currentCategoryList.filter((m) => m.id !== movieId);

      return {
        ...prev,
        [category]: updateList,
      };
    });

    // remove to appwrite
    if (user) {
      try {
        await removeMovieFromAppwrite(user.$id, movieId, category);
        console.log(`Movie successfully removed from Appwrite in ${category}!`);
      } catch (error) {
        console.log("Error removing movie from Appwrite:", error);
      }
    }
  };

  return (
    <SavedMoviesContext.Provider
      value={{ savedMovies, saveMovie, removeMovie }}
    >
      {children}
    </SavedMoviesContext.Provider>
  );
};
