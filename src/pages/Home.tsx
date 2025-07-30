import React from "react";
import { useLocation } from "react-router-dom";
import { Search, Star, TrendingUp } from "lucide-react";
import MovieCard from "../components/MovieCard";
import PromoBanner from "../components/PromoBanner";
import { Link } from "react-router-dom";
import {
  fetchPopularMovies,
  fetchGenres,
  TmdbMovie,
  TmdbGenre,
} from "../api/tmdb";
import { useTheme } from "../context/ThemeContext";

const Home: React.FC = () => {
  const location = useLocation();
  const [searchTerm, setSearchTerm] = React.useState("");
  const [movies, setMovies] = React.useState<TmdbMovie[]>([]);
  const [genreMap, setGenreMap] = React.useState<Record<number, string>>({});
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState<string | null>(null);
  const { theme, toggleTheme } = useTheme();

  React.useEffect(() => {
    const params = new URLSearchParams(location.search);
    const q = params.get("search") || "";
    setSearchTerm(q);
  }, [location.search]);

  React.useEffect(() => {
    async function loadData() {
      setLoading(true);
      setError(null);
      try {
        const [popular, genres] = await Promise.all([
          fetchPopularMovies(),
          fetchGenres(),
        ]);

        setMovies(popular);

        const map: Record<number, string> = {};
        genres.forEach((g: TmdbGenre) => {
          map[g.id] = g.name;
        });
        setGenreMap(map);
      } catch (err) {
        console.error(err);
        setError("Failed to load movies or genres.");
      }
      setLoading(false);
    }
    loadData();
  }, []);

  const filtered = movies.filter((m) =>
    [m.title, m.overview]
      .join(" ")
      .toLowerCase()
      .includes(searchTerm.toLowerCase())
  );

  const featured = movies[0];

  if (loading) return <div className="p-8 text-center">Loading…</div>;
  if (error) return <div className="p-8 text-center text-red-600">{error}</div>;

  return (
    <div className="w-full min-h-screen bg-gray-50 dark:bg-gray-900 pt-12 xl:pt-12 md:pt-0 lg:pt-1">
      <div className="relative bg-gradient-to-r from-purple-900 via-blue-900 to-indigo-900 dark:from-gray-900 dark:via-gray-900 dark:to-gray-900">
        <div className="relative max-w-7xl mx-auto px-4 py-12 pt-20 pb-12 text-center">
          <h1 className="text-3xl md:text-4xl font-bold text-white mb-6">
            Book Your Movie
            <span className="block bg-gradient-to-r from-red-400 to-purple-400 bg-clip-text text-transparent">
              Experience Today
            </span>
          </h1>
          <p className="text-xl text-gray-300 dark:text-gray-400 max-w-3xl mx-auto">
            Discover the latest blockbusters and timeless classics.
          </p>
        </div>
      </div>

      <PromoBanner />

      {featured && (
        <section className="max-w-7xl mx-auto px-4 py-12">
          <div className="flex items-center space-x-2 mb-8">
            <TrendingUp className="h-6 w-6 text-red-500" />
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
              Featured Movie
            </h2>
          </div>
          <div className="bg-white dark:bg-gray-800 text-black dark:text-white rounded-xl shadow-lg overflow-hidden md:flex">
            <img
              src={
                featured.poster_path
                  ? `https://image.tmdb.org/t/p/w500${featured.poster_path}`
                  : ""
              }
              alt={featured.title}
              className="w-full md:w-1/3 h-64 md:h-auto object-cover"
            />
            <div className="p-6 md:w-2/3">
              <div className="flex items-center space-x-2 mb-4">
                <h3 className="text-3xl font-bold dark:text-white">
                  {featured.title}
                </h3>
                <p className="text-gray-600 dark:text-gray-300">
                  {featured.release_date}
                </p>
                <div className="flex items-center space-x-1 bg-yellow-100 text-yellow-800 px-2 py-1 rounded-full">
                  <Star className="h-4 w-4 fill-current" />
                  <span className="text-sm font-semibold">
                    {featured.vote_average?.toFixed(1)} / 10
                  </span>
                </div>
              </div>
              <p className="text-gray-600 dark:text-gray-300 mb-4">
                {featured.overview}
              </p>
              <div className="grid grid-cols-2 gap-4 text-sm mb-6">
                <div>
                  <span className="font-semibold">Genre:</span>
                  <p className="text-gray-600 dark:text-gray-300">
                    {featured.genre_ids
                      .map((id) => genreMap[id])
                      .filter(Boolean)
                      .join(", ") || "--"}
                  </p>
                </div>
                <div>
                  <span className="font-semibold">Language:</span>
                  <p className="text-gray-600 dark:text-gray-300">
                    {featured.original_language.toUpperCase()}
                  </p>
                </div>
              </div>
              <Link to={`/movie/${featured.id}`} className="group">
                <button className="bg-red-600 hover:bg-red-700 text-white px-6 py-3 rounded-lg font-semibold">
                  Book Now
                </button>
              </Link>
            </div>
          </div>
        </section>
      )}

      <section className="max-w-7xl mx-auto px-4 pb-12">
        <div className="flex items-center space-x-2 mb-8">
          <Star className="h-6 w-6 text-red-500" />
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
            {searchTerm
              ? `Results for "${searchTerm}" (${filtered.length})`
              : "Now Showing"}
          </h2>
        </div>

        {filtered.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filtered.map((movie) => (
              <MovieCard
                key={movie.id}
                movie={{
                  ...movie,

                  genre_names: movie.genre_ids.map((id) => genreMap[id] || ""),
                }}
              />
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <Search className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 dark:text-white">
              No movies found
            </h3>
            <p className="text-gray-500 dark:text-gray-300 mb-4">
              Try different keywords or clear your search.
            </p>
            <button
              onClick={() => setSearchTerm("")}
              className="text-red-600 dark:text-red-400 hover:text-red-700 dark:hover:text-red-300 font-medium"
            >
              Clear Search
            </button>
          </div>
        )}
      </section>
    </div>
  );
};

export default Home;
