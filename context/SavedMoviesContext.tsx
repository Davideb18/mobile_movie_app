import {
  createContext,
  ReactNode,
  useContext,
  useEffect,
  useState,
} from "react";
import {
  deleteCategoryFromAppwrite,
  getSavedMoviesFromAppwrite,
  rateMovieInAppwrite,
  removeMovieFromAppwrite,
  savemovieToAppwrite,
} from "../services/appwrite";
import { useGlobalContext } from "./GlobalProvider";

interface SavedMoviesContextType {
  savedMovies: Record<string, any[]>;

  saveMovie: (movie: any, category: string) => void;

  removeMovie: (movieId: number, category: string) => void;
  rateMovie: (movieId: number, category: string, rating: number) => void;
  createCategory: (category: string) => void;

  deleteCategory: (category: string) => void;
}

export const SavedMoviesContext = createContext<SavedMoviesContextType | null>(
  null,
);

export const useSavedMovies = () => {
  const context = useContext(SavedMoviesContext);
  if (!context) {
    throw new Error("useSavedMovies must be used inside a SavedMoviesProvider");
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
      } catch (error) {}
    };
    fetchMovies();
  }, [user]);

  const saveMovie = async (movie: any, category: string) => {
    setSavedMovies((prev) => {
      const currentCategoryList = prev[category] || [];
      const isAldreadySaved = currentCategoryList.some(
        (m) => m.id === movie.id,
      );

      if (isAldreadySaved) return prev;

      return {
        ...prev,
        [category]: [movie, ...currentCategoryList],
      };
    });

    if (user) {
      try {
        await savemovieToAppwrite(user.$id, movie, category);
      } catch (error) {
        // silently fail — local state is already updated
      }
    }
  };

  const removeMovie = async (movieId: number, category: string) => {
    setSavedMovies((prev) => {
      const currentCategoryList = prev[category] || [];
      const updateList = currentCategoryList.filter((m) => m.id !== movieId);
      return {
        ...prev,
        [category]: updateList,
      };
    });

    if (user) {
      try {
        await removeMovieFromAppwrite(user.$id, movieId, category);
      } catch (error) {
        // silently fail — local state is already updated
      }
    }
  };

  const createCategory = (category: string) => {
    setSavedMovies((prev) => {
      if (prev[category]) return prev;
      return {
        ...prev,
        [category]: [],
      };
    });
  };

  // deleteCategory
  const deleteCategory = async (category: string) => {
    setSavedMovies((prev) => {
      const newState = { ...prev };
      delete newState[category];
      return newState;
    });

    if (user) {
      try {
        await deleteCategoryFromAppwrite(user.$id, category);
      } catch (error) {
        // silently fail — local state is already updated
      }
    }
  };

  return (
    <SavedMoviesContext.Provider
      value={{
        savedMovies,
        saveMovie,
        removeMovie,
        createCategory,
        deleteCategory,
        rateMovie: async (
          movieId: number,
          category: string,
          rating: number,
        ) => {
          setSavedMovies((prev) => {
            const newState = { ...prev };
            // Update the rating in EVERY category where this movie exists
            Object.keys(newState).forEach((cat) => {
              newState[cat] = newState[cat].map((m) =>
                m.id === movieId ? { ...m, $rating: rating } : m,
              );
            });
            return newState;
          });

          if (user) {
            try {
              await rateMovieInAppwrite(user.$id, movieId, category, rating);
            } catch (error) {
              // silent fail
            }
          }
        },
      }}
    >
      {children}
    </SavedMoviesContext.Provider>
  );
};
