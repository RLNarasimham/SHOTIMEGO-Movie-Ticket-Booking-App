// import React, { useEffect, useState } from "react";
// import { useParams, Link } from "react-router-dom";

// const backendURL = import.meta.env.VITE_BACKEND_URL;

// const ConcertDetail: React.FC = () => {
//   const { id } = useParams();
//   const [concert, setConcert] = useState<any>(null);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState<string | null>(null);

//   useEffect(() => {
//     fetch(`${backendURL}/api/concerts/${id}`)
//       .then((res) => {
//         if (!res.ok) throw new Error("Concert not found");
//         return res.json();
//       })
//       .then((data) => {
//         setConcert(data);
//         setLoading(false);
//       })
//       .catch((err) => {
//         setError(err.message);
//         setLoading(false);
//       });
//   }, [id]);

//   if (loading)
//     return (
//       <div className="text-center mt-8 text-gray-700 dark:text-gray-200">
//         Loading concert details...
//       </div>
//     );
//   if (error)
//     return (
//       <div className="text-center mt-8 text-red-600 dark:text-red-400">
//         Error: {error}
//       </div>
//     );
//   if (!concert)
//     return (
//       <div className="text-center mt-8 text-gray-500 dark:text-gray-400">
//         No concert found.
//       </div>
//     );

//   return (
//     <div className="min-h-[calc(100vh-120px)] flex items-center justify-center bg-transparent dark:bg-gray-800">
//       <div className="max-w-2xl w-full mx-auto p-6 bg-white dark:bg-gray-900 rounded-3xl shadow-md">
//         <img
//           src={concert.image}
//           alt={concert.name}
//           className="mx-auto w-2/3 h-96 object-contain rounded-lg mb-4 bg-gray-100 dark:bg-gray-800"
//         />
//         <h2 className="text-2xl font-bold mb-2 text-gray-900 dark:text-white">
//           {concert.name}
//         </h2>
//         <p className="mb-1 text-gray-700 dark:text-gray-300">
//           Date: <span className="font-medium">{concert.date}</span> at{" "}
//           <span className="font-medium">{concert.time}</span>
//         </p>
//         <p className="mb-1 text-gray-700 dark:text-gray-300">
//           Venue: <span className="font-medium">{concert.venue}</span>,{" "}
//           <span className="font-medium">{concert.city}</span>
//         </p>
//         <p className="mb-1 text-red-600 dark:text-red-400 font-semibold">
//           ₹{concert.price} per ticket
//         </p>
//         <Link
//           to={`/booking/concert/${concert.id}/st1`}
//           className="inline-block mt-6 px-6 py-3 bg-red-600 text-white rounded-lg font-semibold hover:bg-red-700 dark:bg-red-700 dark:hover:bg-red-800 transition"
//         >
//           Book Now
//         </Link>
//       </div>
//     </div>
//   );
// };

// export default ConcertDetail;

import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";

// Define the concert interface for better type safety
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

interface ApiResponse {
  success: boolean;
  data: Concert;
  error?: string;
  message?: string;
}

const backendURL = import.meta.env.VITE_BACKEND_URL;

const ConcertDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [concert, setConcert] = useState<Concert | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchConcert = async () => {
      try {
        console.log(`Fetching concert with ID: ${id}`);
        console.log(`Backend URL: ${backendURL}`);

        const response = await fetch(`${backendURL}/api/concerts/${id}`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        });

        console.log(`Response status: ${response.status}`);

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data: ApiResponse = await response.json();
        console.log("API Response:", data);

        if (data.success && data.data) {
          setConcert(data.data);
          console.log("Concert data set:", data.data);
        } else {
          throw new Error(data.message || "Concert not found");
        }
      } catch (err) {
        console.error("Error fetching concert:", err);
        setError(
          err instanceof Error ? err.message : "Failed to fetch concert"
        );
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchConcert();
    } else {
      setError("No concert ID provided");
      setLoading(false);
    }
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-[calc(100vh-120px)] flex items-center justify-center bg-transparent dark:bg-gray-800">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-600 mx-auto mb-4"></div>
          <p className="text-gray-700 dark:text-gray-200">
            Loading concert details...
          </p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-[calc(100vh-120px)] flex items-center justify-center bg-transparent dark:bg-gray-800">
        <div className="text-center max-w-md mx-auto p-6">
          <div className="text-red-600 dark:text-red-400 text-6xl mb-4">⚠️</div>
          <h2 className="text-xl font-semibold text-red-600 dark:text-red-400 mb-2">
            Error Loading Concert
          </h2>
          <p className="text-gray-700 dark:text-gray-300 mb-4">{error}</p>
          <Link
            to="/concerts"
            className="inline-block px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition"
          >
            Back to Concerts
          </Link>
        </div>
      </div>
    );
  }

  if (!concert) {
    return (
      <div className="min-h-[calc(100vh-120px)] flex items-center justify-center bg-transparent dark:bg-gray-800">
        <div className="text-center max-w-md mx-auto p-6">
          <div className="text-gray-500 dark:text-gray-400 text-6xl mb-4">
            🎵
          </div>
          <h2 className="text-xl font-semibold text-gray-500 dark:text-gray-400 mb-2">
            Concert Not Found
          </h2>
          <p className="text-gray-600 dark:text-gray-400 mb-4">
            The concert you're looking for doesn't exist.
          </p>
          <Link
            to="/concerts"
            className="inline-block px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition"
          >
            Browse All Concerts
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-[calc(100vh-120px)] flex items-center justify-center bg-transparent dark:bg-gray-800 py-8"
      styl
    >
      <div className="max-w-2xl w-full mx-auto p-6 bg-white dark:bg-gray-900 rounded-3xl shadow-lg">
        {/* Concert Image */}
        <div className="mb-6">
          <img
            src={concert.image}
            alt={concert.name}
            className="mx-auto w-full max-w-md h-80 object-cover rounded-xl shadow-md bg-gray-100 dark:bg-gray-800"
            onError={(e) => {
              const target = e.target as HTMLImageElement;
              target.src =
                "https://via.placeholder.com/400x300/ef4444/ffffff?text=Concert+Image";
            }}
          />
        </div>

        {/* Concert Details */}
        <div className="text-center space-y-4">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
            {concert.name}
          </h1>

          <div className="space-y-2 text-lg">
            <div className="flex items-center justify-center text-gray-700 dark:text-gray-300">
              <span className="mr-2">📅</span>
              <span>
                <span className="font-medium">{concert.date}</span> at{" "}
                <span className="font-medium">{concert.time}</span>
              </span>
            </div>

            <div className="flex items-center justify-center text-gray-700 dark:text-gray-300">
              <span className="mr-2">📍</span>
              <span>
                <span className="font-medium">{concert.venue}</span>,{" "}
                <span className="font-medium">{concert.city}</span>
              </span>
            </div>

            <div className="flex items-center justify-center text-2xl font-bold text-red-600 dark:text-red-400">
              <span className="mr-2">💰</span>
              <span>₹{concert.price.toLocaleString()} per ticket</span>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center mt-8">
            <Link
              to={`/booking/concert/${concert.id}/st1`}
              className="px-8 py-3 bg-red-600 text-white rounded-xl font-semibold hover:bg-red-700 dark:bg-red-700 dark:hover:bg-red-800 transition-colors duration-200 shadow-lg hover:shadow-xl"
            >
              🎫 Book Now
            </Link>

            <Link
              to="/concerts"
              className="px-8 py-3 bg-gray-200 text-gray-800 dark:bg-gray-700 dark:text-gray-200 rounded-xl font-semibold hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors duration-200"
            >
              ← Back to Concerts
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ConcertDetail;
