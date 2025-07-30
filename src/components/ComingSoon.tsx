import React from "react";

const comingSoonMovies = [
  {
    id: "1",
    title: "The Marvels",
    poster:
      "https://cdn.marvel.com/content/1x/themarvels_imax_digital_supplemental_tix_v3_lg.jpg",
    releaseDate: "2025-08-15",
    language: "English",
  },
  {
    id: "2",
    title: "Pushpa 2: The Rule",
    poster:
      "https://images.fandango.com/ImageRenderer/820/0/redesign/static/img/default_poster.png/0/images/masterrepository/fandango/238502/pushpa2therule-posterart-sm.jpg",
    releaseDate: "2025-09-02",
    language: "Telugu",
  },
  {
    id: "3",
    title: "Jawan 2",
    poster:
      "https://tse2.mm.bing.net/th/id/OIP.HNQcxV9GgaQTcMuzxjwEawHaK_?r=0&rs=1&pid=ImgDetMain&o=7&rm=3",
    releaseDate: "2025-09-30",
    language: "Hindi",
  },
];

const ComingSoon: React.FC = () => {
  return (
    <section
      className="sm:px-6 pt-16 flex flex-col justify-center w-full bg-gray-100 dark:bg-gray-900 min-h-[calc(100vh-64px)] transition-colors duration-300"
      style={{ paddingTop: "9rem", paddingBottom: "6rem" }}
    >
      <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-8 text-center">
        🎬 Coming Soon
      </h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8">
        {comingSoonMovies.map((movie) => (
          <div
            key={movie.id}
            className="bg-white h-full dark:bg-gray-800 rounded-xl shadow-md hover:shadow-lg transition-shadow duration-300 flex flex-col"
          >
            <img
              src={movie.poster}
              alt={movie.title}
              className="w-full h-74 object-cover object-center rounded-t-xl"
            />
            <div className="p-4 flex flex-col flex-1">
              <h3 className="text-xl font-semibold text-gray-800 dark:text-white mb-2">
                {movie.title}
              </h3>
              <p className="text-sm text-gray-600 dark:text-gray-300 mb-4">
                Releases on: {movie.releaseDate}
              </p>
              <p className="text-xs text-gray-400 dark:text-gray-500 mb-4">
                Language: {movie.language}
              </p>
              <button className="w-full mt-auto bg-red-600 hover:bg-red-700 text-white font-medium py-2 rounded-lg transition-colors">
                Pre-Book Now
              </button>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};

export default ComingSoon;
