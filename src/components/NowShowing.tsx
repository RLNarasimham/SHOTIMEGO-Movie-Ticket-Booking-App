import React from "react";
import { Link } from "react-router-dom";

const nowShowingMovies = [
  {
    id: 1,
    title: "Kalki 2898 AD",
    language: "Telugu, Hindi, Tamil",
    genre: "Sci-Fi, Action",
    duration: "2h 50m",
    poster: "https://www.masala.com/cloud/2024/06/11/Kalki-2898-AD.png",
  },
  {
    id: 2,
    title: "Deadpool & Wolverine",
    language: "English, Hindi, Telugu",
    genre: "Action, Comedy",
    duration: "2h 10m",
    poster:
      "https://sportshub.cbsistatic.com/i/2024/06/10/e4144cf0-43de-4c30-9813-68f514add7b7/deadpool-wolverine-screenx-poster.jpg?auto=webp&width=1944&height=2880&crop=0.675:1,smart",
  },
  {
    id: 3,
    title: "Sarfira",
    language: "Hindi",
    genre: "Drama, Biopic",
    duration: "2h 20m",
    poster:
      "https://thelucknowtribune.org/wp-content/uploads/2024/06/Sarfira.webp",
  },
  {
    id: 4,
    title: "Indian 2",
    language: "Tamil, Telugu, Hindi",
    genre: "Action, Thriller",
    duration: "2h 45m",
    poster:
      "https://tse2.mm.bing.net/th/id/OIP.FD2hAW48YpvcGxUyGDt7VgHaJP?r=0&rs=1&pid=ImgDetMain&o=7&rm=3",
  },
];

const NowShowing = () => {
  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">
        🎬 Now Showing
      </h2>

      <div className="grid gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
        {nowShowingMovies.map((movie) => (
          <div
            key={movie.id}
            className="bg-white rounded-xl overflow-hidden shadow hover:shadow-lg transition-shadow"
          >
            <img
              src={movie.poster}
              alt={movie.title}
              className="w-full h-80 object-cover object-top rounded-t-xl"
            />
            <div className="p-4 space-y-2">
              <h3 className="text-lg font-semibold text-gray-800">
                {movie.title}
              </h3>
              <p className="text-sm text-gray-600">{movie.language}</p>
              <p className="text-sm text-gray-600">{movie.genre}</p>
              <p className="text-sm text-gray-600">{movie.duration}</p>

              <Link
                to={`/movie/${movie.id}`}
                className="inline-block mt-3 w-full text-center bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg font-semibold transition-colors"
              >
                View Details
              </Link>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};

export default NowShowing;
