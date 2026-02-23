export const TMDB_CONFIG = {
  BASE_URL: "https://api.themoviedb.org/3",
  API_KEY: process.env.EXPO_PUBLIC_MOVIE_API_KEY,
  header: {
    accept: "application/json",
    Authorization: `Bearer ${process.env.EXPO_PUBLIC_MOVIE_API_KEY}`,
  },
};

export const fetchTrendingMovies = async (): Promise<any[]> => {
  try {
    const response = await fetch(
      `${TMDB_CONFIG.BASE_URL}/trending/movie/day?language=en-US`,
      {
        method: "GET",
        headers: TMDB_CONFIG.header,
      },
    );

    if (!response.ok) throw new Error("FAILED TO FETCH TRENDING MOVIES");

    const data = await response.json();
    return data.results;
  } catch (error) {
    console.log(error);
    throw error;
  }
};

export const fetchMovies = async ({ query }: { query: string }) => {
  const endpoint = query
    ? `${TMDB_CONFIG.BASE_URL}/search/movie?query=${encodeURIComponent(query)}`
    : `${TMDB_CONFIG.BASE_URL}/discover/movie?sort_by=popularity.desc`;

  const response = await fetch(endpoint, {
    method: "GET",
    headers: TMDB_CONFIG.header,
  });

  if (!response.ok) {
    // @ts-ignore
    throw new Error("FAILED TO FETCH MOVIES", response.statusText);
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

    if (!response.ok) throw new Error("FAILED TO FETCH MOVIE DETAILS");

    const data = await response.json();

    return data;
  } catch (error) {
    console.log(error);
    throw error;
  }
};

/*fetch(url, options)
    .then(res => res.json())
    .then(json => console.log(json))
    .catch(err => console.error(err));
 */
