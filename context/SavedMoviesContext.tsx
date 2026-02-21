import { createContext, ReactNode, useContext, useState } from "react";

interface SavedMoviesContextType {
  savedMovies: Record<string, any[]>;

  saveMovie: (movie: any, category: string) => void;

  removeMovie: (moiveId: string, category: string) => void;
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

  // saveMovie
  const saveMovie = (movie: any, category: string) => {
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
  };

  // removeMovie
  const removeMovie = (movieId: string, category: string) => {
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
  };

  return (
    <SavedMoviesContext.Provider
      value={{ savedMovies, saveMovie, removeMovie }}
    >
      {children}
    </SavedMoviesContext.Provider>
  );
};
