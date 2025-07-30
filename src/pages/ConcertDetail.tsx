import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";

const backendURL = import.meta.env.VITE_BACKEND_URL;

const ConcertDetail: React.FC = () => {
  const { id } = useParams();
  const [concert, setConcert] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetch(`${backendURL}/api/concerts/${id}`)
      .then((res) => {
        if (!res.ok) throw new Error("Concert not found");
        return res.json();
      })
      .then((data) => {
        setConcert(data);
        setLoading(false);
      })
      .catch((err) => {
        setError(err.message);
        setLoading(false);
      });
  }, [id]);

  if (loading)
    return (
      <div className="text-center mt-8 text-gray-700 dark:text-gray-200">
        Loading concert details...
      </div>
    );
  if (error)
    return (
      <div className="text-center mt-8 text-red-600 dark:text-red-400">
        Error: {error}
      </div>
    );
  if (!concert)
    return (
      <div className="text-center mt-8 text-gray-500 dark:text-gray-400">
        No concert found.
      </div>
    );

  return (
    <div className="min-h-[calc(100vh-120px)] flex items-center justify-center bg-transparent dark:bg-gray-800">
      <div className="max-w-2xl w-full mx-auto p-6 bg-white dark:bg-gray-900 rounded-3xl shadow-md">
        <img
          src={concert.image}
          alt={concert.name}
          className="mx-auto w-2/3 h-96 object-contain rounded-lg mb-4 bg-gray-100 dark:bg-gray-800"
        />
        <h2 className="text-2xl font-bold mb-2 text-gray-900 dark:text-white">
          {concert.name}
        </h2>
        <p className="mb-1 text-gray-700 dark:text-gray-300">
          Date: <span className="font-medium">{concert.date}</span> at{" "}
          <span className="font-medium">{concert.time}</span>
        </p>
        <p className="mb-1 text-gray-700 dark:text-gray-300">
          Venue: <span className="font-medium">{concert.venue}</span>,{" "}
          <span className="font-medium">{concert.city}</span>
        </p>
        <p className="mb-1 text-red-600 dark:text-red-400 font-semibold">
          ₹{concert.price} per ticket
        </p>
        <Link
          to={`/booking/concert/${concert.id}/st1`}
          className="inline-block mt-6 px-6 py-3 bg-red-600 text-white rounded-lg font-semibold hover:bg-red-700 dark:bg-red-700 dark:hover:bg-red-800 transition"
        >
          Book Now
        </Link>
      </div>
    </div>
  );
};

export default ConcertDetail;
