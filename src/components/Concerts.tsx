import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";

const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;

interface Concert {
  id: string;
  name: string;
  date: string;
  time: string;
  venue: string;
  city: string;
  image: string;
  price: number;
}

const Concerts: React.FC = () => {
  const [concerts, setConcerts] = useState<Concert[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetch(`${BACKEND_URL}/api/concerts`)
      .then((res) => {
        if (!res.ok) throw new Error("Failed to fetch concerts");
        return res.json();
      })
      .then((data) => {
        console.log("Fetched concerts:", data);
        // FIX: Extract the data array from the response object
        if (data.success && Array.isArray(data.data)) {
          setConcerts(data.data);
        } else {
          throw new Error("Invalid data format received");
        }
        setLoading(false);
      })
      .catch((err) => {
        console.error("Error fetching concerts:", err);
        setError(err.message);
        setLoading(false);
      });
  }, []);

  if (loading) {
    return (
      <div className="w-full pt-32 bg-gray-50 dark:bg-gray-700 min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-600 mx-auto mb-4"></div>
          <p className="text-lg text-gray-600 dark:text-gray-300">
            Loading concerts...
          </p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="w-full pt-32 bg-gray-50 dark:bg-gray-700 min-h-screen flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-600 dark:text-red-400 text-lg mb-4">
            Error: {error}
          </p>
          <button
            onClick={() => window.location.reload()}
            className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full pt-32 bg-gray-50 dark:bg-gray-700 min-h-screen">
      <h2 className="text-3xl font-bold text-center text-gray-900 dark:text-white mb-8">
        🎤 Upcoming Concerts
      </h2>

      <div className="w-full grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 px-2 sm:px-4 md:px-8">
        {concerts.length === 0 ? (
          <div className="text-center col-span-full text-gray-500 dark:text-gray-300 text-lg mt-8">
            No concerts found.
          </div>
        ) : (
          concerts.map((concert) => (
            <div
              key={concert.id}
              className="bg-white dark:bg-gray-800 shadow-md rounded-2xl overflow-hidden hover:shadow-lg transition-shadow"
            >
              <img
                src={concert.image}
                alt={concert.name}
                className="w-full h-80 md:h-96 lg:h-[28rem] object-cover object-top"
                onError={(e) => {
                  e.currentTarget.src = "/placeholder-concert.jpg"; // Fallback image
                }}
              />
              <div className="p-4 space-y-2">
                <h3 className="text-xl font-semibold text-gray-800 dark:text-white">
                  {concert.name}
                </h3>
                <p className="text-sm text-gray-600 dark:text-gray-300">
                  {concert.date} at {concert.time}
                </p>
                <p className="text-sm text-gray-600 dark:text-gray-300">
                  📍 {concert.venue}, {concert.city}
                </p>
                <p className="text-sm font-semibold text-red-600 dark:text-red-400">
                  ₹{concert.price} per ticket
                </p>
                <Link
                  to={`/concert/${concert.id}`}
                  className="inline-block mt-3 px-4 py-2 bg-red-600 text-white rounded-lg font-semibold hover:bg-red-700 transition"
                >
                  Book Now
                </Link>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default Concerts;
