import React from "react";
import { Link } from "react-router-dom";
import { Star, Calendar } from "lucide-react";

interface TMDBMovie {
  id: number;
  title: string;
  poster_path: string | null;
  overview: string;
  vote_average: number;
  release_date: string;
  genre_names: Array;
}

interface MovieCardProps {
  movie: TMDBMovie;
}

const MovieCard: React.FC<MovieCardProps> = ({ movie }) => {
  return (
    <Link to={`/movie/${movie.id}`} className="group">
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden transform group-hover:scale-105 transition-all duration-300 group-hover:shadow-xl">
        <div className="relative">
          <img
            src={
              movie.poster_path
                ? `https://image.tmdb.org/t/p/w500${movie.poster_path}`
                : "https://via.placeholder.com/300x450?text=No+Image"
            }
            alt={movie.title}
            className="w-full h-100 object-cover"
          />
          <div className="absolute top-2 right-2 bg-yellow-500 text-white px-2 py-1 rounded-full flex items-center space-x-1 text-sm font-semibold">
            <Star className="h-3 w-3 fill-current" />
            <span>{movie.vote_average ?? "--"}</span>
          </div>
        </div>

        <div className="p-4">
          <h3 className="font-bold text-lg text-gray-900 dark:text-white mb-2 line-clamp-1">
            {movie.title}
          </h3>

          <p className="text-gray-600 dark:text-gray-300 text-sm mb-3 line-clamp-2">
            {movie.overview}
          </p>

          <div className="flex items-center justify-between text-sm text-gray-500 dark:text-gray-400 mb-2">
            
            <div className="flex items-center space-x-1">
              <Calendar className="h-4 w-4" />
              <span>
                {movie.release_date
                  ? new Date(movie.release_date).getFullYear()
                  : "N/A"}
              </span>
            </div>
          </div>

          <div className="text-sm text-gray-600 dark:text-gray-300 mb-3">
            <span className="font-medium">Genres:</span>{" "}
            
            {movie.genre_names.join(", ")}
          </div>

          
        </div>
      </div>
    </Link>
  );
};

export default MovieCard;
