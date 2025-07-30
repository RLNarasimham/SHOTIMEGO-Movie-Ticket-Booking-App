import React, { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { ArrowLeft, Star, Clock, Calendar, MapPin, Users } from "lucide-react";
import { useAuth } from "../context/AuthContext";
import { TmdbCredits, Movie, ShowTime, TmdbMovieDetail } from "../types";

const MovieDetail: React.FC = () => {
  const { id } = useParams();
  const [movie, setMovie] = useState<Movie | null>(null);
  const [loading, setLoading] = useState(true);
  const { currentUser } = useAuth();

  useEffect(() => {
    if (!id) return;

    const fetchMovie = async () => {
      try {
        setLoading(true);

        // const res1 = await fetch(
        //   `https://api.themoviedb.org/3/movie/${id}?api_key=${import.meta.env.VITE_TMDB_API_KEY
        //   }&language=en-US`
        // );
        // const detail: TmdbMovieDetail = await res1.json();

        // const res2 = await fetch(
        //   `https://api.themoviedb.org/3/movie/${id}/credits?api_key=${import.meta.env.VITE_TMDB_API_KEY
        //   }`
        // );
        const backendUrl = import.meta.env.VITE_BACKEND_URL;

        // Fetch movie details from backend
        const res1 = await fetch(`${backendUrl}/api/movies/${id}`);
        const detail: TmdbMovieDetail = await res1.json();

        // Fetch credits from backend
        const res2 = await fetch(`${backendUrl}/api/movies/${id}/credits`);

        const credits: TmdbCredits = await res2.json();

        const directorMember = credits.crew.find((m) => m.job === "Director");
        const director = directorMember ? directorMember.name : "";
        const cast = credits.cast.slice(0, 10).map((member) => member.name);

        const showTimesData: ShowTime[] = [
          {
            id: "st1",
            time: "10:00 AM",
            date: "2025-07-22",
            theater: "PVR City Mall",
            screen: "Screen 1",
            price: 250,
          },
          {
            id: "st2",
            time: "1:00 PM",
            date: "2025-07-22",
            theater: "PVR City Mall",
            screen: "Screen 2",
            price: 250,
          },
          {
            id: "st3",
            time: "6:00 PM",
            date: "2025-07-22",
            theater: "PVR City Mall",
            screen: "Screen 3",
            price: 300,
          },
        ];

        setMovie({
          id: detail.id.toString(),
          title: detail.title,
          poster: detail.poster_path
            ? `https://image.tmdb.org/t/p/w500${detail.poster_path}`
            : "",
          rating: detail.vote_average,
          duration: detail.runtime ?? 0,
          genre: detail.genres?.map((g) => g.name).join(", ") ?? "N/A",
          cast,
          director,
          description: detail.overview,
          releaseDate: detail.release_date,
          language: detail.original_language,
          showTimes: showTimesData,
        });
      } catch (err) {
        console.error("Error loading movie detail:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchMovie();
  }, [id]);

  if (loading) {
    return <div>Loading…</div>;
  }

  if (!movie) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
            Movie Not Found
          </h2>
          <Link
            to="/"
            className="text-red-600 dark:text-red-400 hover:text-red-700 dark:hover:text-red-300"
          >
            Return to Home
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="bg-white dark:bg-black shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 dark:bg-black bg-white lg:px-8 py-4">
          <Link
            to="/"
            className="inline-flex items-center space-x-2 text-black dark:text-white transition-colors"
          >
            <ArrowLeft className="h-5 w-5" />
            <span>Back to Movies</span>
          </Link>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg overflow-hidden">
          <div className="md:flex">
            <div className="md:w-1/3">
              <img
                src={movie.poster}
                alt={movie.title}
                className="w-full h-96 md:h-full object-cover"
              />
            </div>

            <div className="md:w-2/3 p-6 md:p-8 text-gray-900 dark:text-white">
              <div className="flex items-start justify-between mb-6">
                <div>
                  <h1 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-2">
                    {movie.title}
                  </h1>
                  <div className="flex items-center space-x-4 text-sm text-gray-600 dark:text-gray-300">
                    <div className="flex items-center space-x-1">
                      <Star className="h-4 w-4 text-yellow-500 fill-current" />
                      <span className="font-semibold">{movie.rating}</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <Clock className="h-4 w-4" />
                      <span>{movie.duration} min</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <Calendar className="h-4 w-4" />
                      <span>{new Date(movie.releaseDate).getFullYear()}</span>
                    </div>
                  </div>
                </div>
              </div>

              <p className="text-gray-600 dark:text-gray-300 mb-6 leading-relaxed">
                {movie.description}
              </p>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                <div>
                  <h3 className="font-semibold text-gray-900 dark:text-white mb-2">
                    Movie Details
                  </h3>
                  <div className="space-y-2 text-sm">
                    <div>
                      <span className="font-medium">Director:</span>
                      <span className="ml-2 text-gray-600 dark:text-gray-300">
                        {movie.director}
                      </span>
                    </div>
                    <div>
                      <span className="font-medium">Genre:</span>
                      <span className="ml-2 text-gray-600 dark:text-gray-300">
                        {movie.genre}
                      </span>
                    </div>
                    <div>
                      <span className="font-medium">Language:</span>
                      <span className="ml-2 text-gray-600 dark:text-gray-300">
                        {movie.language}
                      </span>
                    </div>
                  </div>
                </div>

                <div>
                  <h3 className="font-semibold text-gray-900 dark:text-white mb-2">
                    Cast
                  </h3>
                  <div className="flex flex-wrap gap-2">
                    {movie.cast.map((actor, index) => (
                      <span
                        key={index}
                        className="bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-white px-3 py-1 rounded-full text-sm"
                      >
                        {actor}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {movie.showTimes.length > 0 && (
          <div className="mt-8 bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
              Show Times
            </h2>

            <div className="grid gap-4">
              {movie.showTimes.map((showTime) => (
                <div
                  key={showTime.id}
                  className="border border-gray-200 dark:border-gray-700 rounded-lg p-4 hover:shadow-md transition-shadow bg-gray-50 dark:bg-gray-900"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-6">
                      <div>
                        <div className="font-semibold text-lg text-gray-900 dark:text-white">
                          {showTime.time}
                        </div>
                        <div className="text-sm text-gray-600 dark:text-gray-300">
                          {showTime.date}
                        </div>
                      </div>

                      <div className="flex items-center space-x-1 text-gray-600 dark:text-gray-300">
                        <MapPin className="h-4 w-4" />
                        <span className="text-sm">{showTime.theater}</span>
                      </div>

                      <div className="text-sm text-gray-600 dark:text-gray-300">
                        {showTime.screen}
                      </div>
                    </div>

                    <div className="flex items-center space-x-4">
                      <div className="text-right">
                        <div className="text-lg font-bold text-gray-900 dark:text-white">
                          ₹{showTime.price}
                        </div>
                        <div className="text-sm text-gray-600 dark:text-gray-300">
                          per seat
                        </div>
                      </div>

                      {currentUser ? (
                        <Link
                          to={`/booking/movie/${movie.id}/${showTime.id}`}
                          className="bg-red-600 hover:bg-red-700 text-white px-6 py-2 rounded-lg font-semibold transition-colors flex items-center space-x-2"
                        >
                          <Users className="h-4 w-4" />
                          <span>Book Seats</span>
                        </Link>
                      ) : (
                        <Link
                          to="/login"
                          className="bg-gray-600 hover:bg-gray-700 text-white px-6 py-2 rounded-lg font-semibold transition-colors"
                        >
                          Login to Book
                        </Link>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default MovieDetail;
