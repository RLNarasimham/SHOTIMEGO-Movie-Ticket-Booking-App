// const TMDB_API_KEY = import.meta.env.VITE_TMDB_API_KEY;
// console.log("TMDB API KEY:", TMDB_API_KEY);
// const BASE_URL = "https://api.themoviedb.org/3";

export interface TmdbGenre {
  id: number;
  name: string;
}

export interface TmdbMovie {
  id: number;
  title: string;
  poster_path: string | null;
  overview: string;
  vote_average: number;
  release_date: string;
  genre_ids: number[];
  original_language: string;
}

// export async function fetchPopularMovies(): Promise<TmdbMovie[]> {
//   const res = await fetch(
//     `${BASE_URL}/movie/popular?api_key=${TMDB_API_KEY}&language=en-US&page=1`
//   );
//   if (!res.ok) throw new Error("Failed to fetch popular movies");
//   const data = await res.json();
//   return data.results;
// }

export async function fetchPopularMovies(): Promise<TmdbMovie[]> {
  const backendUrl = import.meta.env.VITE_BACKEND_URL;
  const res = await fetch(`${backendUrl}/api/movies/popular`);
  if (!res.ok) throw new Error("Failed to fetch popular movies");
  const data = await res.json();
  return data.results;
}

// export async function fetchGenres(): Promise<TmdbGenre[]> {
//   const res = await fetch(
//     `${BASE_URL}/genre/movie/list?api_key=${TMDB_API_KEY}&language=en`
//   );
//   if (!res.ok) throw new Error("Failed to fetch genre list");
//   const data = await res.json();
//   return data.genres;
// }

export async function fetchGenres(): Promise<TmdbGenre[]> {
  const backendUrl = import.meta.env.VITE_BACKEND_URL;
  const res = await fetch(`${backendUrl}/api/movies/genres`);
  if (!res.ok) throw new Error("Failed to fetch genre list");
  const data = await res.json();
  return data.genres;
}
