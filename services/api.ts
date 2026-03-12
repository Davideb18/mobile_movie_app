export const TMDB_CONFIG = {
  BASE_URL: "https://api.themoviedb.org/3",
  // NOTE: In a production app, this API key should be hidden behind a secure backend proxy.
  // For this portfolio CV project, it's accessed directly on the client for simplicity.
  API_KEY: process.env.EXPO_PUBLIC_MOVIE_API_KEY,
  header: {
    accept: "application/json",
    Authorization: `Bearer ${process.env.EXPO_PUBLIC_MOVIE_API_KEY}`,
  },
};

export const fetchTrendingMovies = async (): Promise<Movie[]> => {
  try {
    const response = await fetch(
      `${TMDB_CONFIG.BASE_URL}/trending/movie/day?language=en-US`,
      {
        method: "GET",
        headers: TMDB_CONFIG.header,
      },
    );

    if (!response.ok) throw new Error("Failed to fetch trending movies");

    const data = await response.json();
    return data.results;
  } catch (error) {
    console.log(error);
    throw error;
  }
};

// genre name → TMDB genre ID mapping
const TMDB_GENRES: Record<string, number> = {
  Action: 28,
  Adventure: 12,
  Animation: 16,
  Comedy: 35,
  Crime: 80,
  Documentary: 99,
  Drama: 18,
  Family: 10751,
  Fantasy: 14,
  History: 36,
  Horror: 27,
  Music: 10402,
  Mystery: 9648,
  Romance: 10749,
  ScienceFiction: 878,
  "Science Fiction": 878,
  "Sci-Fi": 878,
  Scifi: 878,
  TvMovie: 10770,
  "TV Movie": 10770,
  Thriller: 53,
  War: 10752,
  Western: 37,
};

export const fetchMovies = async ({
  query,
  page = 1,
}: {
  query: string;
  page?: number;
}): Promise<Movie[]> => {
  let endpoint = `${TMDB_CONFIG.BASE_URL}/discover/movie?sort_by=popularity.desc&page=${page}`;

  if (query) {
    const cleanQuery = query.trim();
    // 1. Check if the user's exact query matches a known TMDB Genre Name (case-insensitive)
    const genreKeys = Object.keys(TMDB_GENRES);
    const matchingGenre = genreKeys.find(
      (g) => g.toLowerCase() === cleanQuery.toLowerCase(),
    );

    if (matchingGenre) {
      // user typed an exact genre name, so use the genre discovery endpoint
      const genreId = TMDB_GENRES[matchingGenre];
      endpoint = `${TMDB_CONFIG.BASE_URL}/discover/movie?with_genres=${genreId}&sort_by=popularity.desc&page=${page}`;
    } else {
      // no genre match — fall back to the full-text search endpoint
      endpoint = `${TMDB_CONFIG.BASE_URL}/search/movie?query=${encodeURIComponent(cleanQuery)}&page=${page}`;
    }
  }

  const response = await fetch(endpoint, {
    method: "GET",
    headers: TMDB_CONFIG.header,
  });

  if (!response.ok) {
    throw new Error("Failed to fetch movies");
  }

  const data = await response.json();

  return data.results;
};

export const fetchMovieDetails = async (
  movieId: string,
): Promise<MovieDetails> => {
  try {
    const response = await fetch(
      `${TMDB_CONFIG.BASE_URL}/movie/${movieId}?api_key=${TMDB_CONFIG.API_KEY}`,
      {
        method: "GET",
        headers: TMDB_CONFIG.header,
      },
    );

    if (!response.ok) throw new Error("Failed to fetch movie details");

    const data = await response.json();

    return data;
  } catch (error) {
    console.log(error);
    throw error;
  }
};

export const fetchMovieByTitle = async (
  title: string,
): Promise<Movie | null> => {
  try {
    const endpoint = `${TMDB_CONFIG.BASE_URL}/search/movie?query=${encodeURIComponent(title)}&page=1`;
    const response = await fetch(endpoint, {
      method: "GET",
      headers: TMDB_CONFIG.header,
    });

    if (!response.ok)
      throw new Error(`Failed to fetch movie by title: ${title}`);

    const data = await response.json();
    return data.results?.[0] || null; // return the top match
  } catch (error) {
    console.error(`Error fetching movie by title ("${title}"):`, error);
    return null;
  }
};
