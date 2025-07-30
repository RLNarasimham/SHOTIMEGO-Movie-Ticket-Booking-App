// import React, { useState, useEffect } from "react";
// import { Link } from "react-router-dom";

// const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;

// interface Concert {
//   id: string;
//   name: string;
//   date: string;
//   time: string;
//   venue: string;
//   city: string;
//   image: string;
//   price: number;
// }

// const Concerts: React.FC = () => {
//   const [concerts, setConcerts] = useState<Concert[]>([]);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState<string | null>(null);

//   useEffect(() => {
//     fetch(`${BACKEND_URL}/api/concerts`)
//       .then((res) => {
//         if (!res.ok) throw new Error("Failed to fetch concerts");
//         return res.json();
//       })
//       .then((data) => {
//         console.log("Fetched concerts:", data);
//         // FIX: Extract the data array from the response object
//         if (data.success && Array.isArray(data.data)) {
//           setConcerts(data.data);
//         } else {
//           throw new Error("Invalid data format received");
//         }
//         setLoading(false);
//       })
//       .catch((err) => {
//         console.error("Error fetching concerts:", err);
//         setError(err.message);
//         setLoading(false);
//       });
//   }, []);

//   if (loading) {
//     return (
//       <div className="w-full pt-32 bg-gray-50 dark:bg-gray-700 min-h-screen flex items-center justify-center">
//         <div className="text-center">
//           <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-600 mx-auto mb-4"></div>
//           <p className="text-lg text-gray-600 dark:text-gray-300">
//             Loading concerts...
//           </p>
//         </div>
//       </div>
//     );
//   }

//   if (error) {
//     return (
//       <div className="w-full pt-32 bg-gray-50 dark:bg-gray-700 min-h-screen flex items-center justify-center">
//         <div className="text-center">
//           <p className="text-red-600 dark:text-red-400 text-lg mb-4">
//             Error: {error}
//           </p>
//           <button
//             onClick={() => window.location.reload()}
//             className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition"
//           >
//             Try Again
//           </button>
//         </div>
//       </div>
//     );
//   }

//   return (
//     <div className="w-full pt-32 bg-gray-50 dark:bg-gray-700 min-h-screen">
//       <h2 className="text-3xl font-bold text-center text-gray-900 dark:text-white mb-8">
//         🎤 Upcoming Concerts
//       </h2>

//       <div className="w-full grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 px-2 sm:px-4 md:px-8">
//         {concerts.length === 0 ? (
//           <div className="text-center col-span-full text-gray-500 dark:text-gray-300 text-lg mt-8">
//             No concerts found.
//           </div>
//         ) : (
//           concerts.map((concert) => (
//             <div
//               key={concert.id}
//               className="bg-white dark:bg-gray-800 shadow-md rounded-2xl overflow-hidden hover:shadow-lg transition-shadow"
//             >
//               <img
//                 src={concert.image}
//                 alt={concert.name}
//                 className="w-full h-80 md:h-96 lg:h-[28rem] object-cover object-top"
//                 onError={(e) => {
//                   e.currentTarget.src = "/placeholder-concert.jpg"; // Fallback image
//                 }}
//               />
//               <div className="p-4 space-y-2">
//                 <h3 className="text-xl font-semibold text-gray-800 dark:text-white">
//                   {concert.name}
//                 </h3>
//                 <p className="text-sm text-gray-600 dark:text-gray-300">
//                   {concert.date} at {concert.time}
//                 </p>
//                 <p className="text-sm text-gray-600 dark:text-gray-300">
//                   📍 {concert.venue}, {concert.city}
//                 </p>
//                 <p className="text-sm font-semibold text-red-600 dark:text-red-400">
//                   ₹{concert.price} per ticket
//                 </p>
//                 <Link
//                   to={`/concert/${concert.id}`}
//                   className="inline-block mt-3 px-4 py-2 bg-red-600 text-white rounded-lg font-semibold hover:bg-red-700 transition"
//                 >
//                   Book Now
//                 </Link>
//               </div>
//             </div>
//           ))
//         )}
//       </div>
//     </div>
//   );
// };

// export default Concerts;

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
    const fetchConcerts = async () => {
      try {
        console.log(
          "🚀 Fetching concerts from:",
          `${BACKEND_URL}/api/concerts`
        );

        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 10000); // 10 second timeout

        const response = await fetch(`${BACKEND_URL}/api/concerts`, {
          signal: controller.signal,
          headers: {
            "Content-Type": "application/json",
            Accept: "application/json",
          },
          mode: "cors", // Explicitly set CORS mode
        });

        clearTimeout(timeoutId);

        console.log("📡 Response status:", response.status);
        console.log(
          "📡 Response headers:",
          Object.fromEntries(response.headers.entries())
        );

        if (!response.ok) {
          const errorText = await response.text();
          console.error("❌ Server error response:", errorText);
          throw new Error(
            `Server error: ${response.status} - ${response.statusText}`
          );
        }

        const data = await response.json();
        console.log("✅ Fetched concerts data:", data);

        // Handle the response structure
        if (data.success && Array.isArray(data.data)) {
          setConcerts(data.data);
          console.log(`✅ Successfully loaded ${data.data.length} concerts`);
        } else if (Array.isArray(data)) {
          // Fallback if data is directly an array
          setConcerts(data);
          console.log(
            `✅ Successfully loaded ${data.length} concerts (direct array)`
          );
        } else {
          console.error("❌ Invalid data format:", data);
          throw new Error("Invalid data format received from server");
        }

        setError(null);
      } catch (err: any) {
        console.error("❌ Error fetching concerts:", err);

        let errorMessage = "Failed to fetch concerts";

        if (err.name === "AbortError") {
          errorMessage = "Request timeout - please check your connection";
        } else if (err.message?.includes("Failed to fetch")) {
          errorMessage =
            "Cannot connect to server - please check if the server is running";
        } else if (err.message?.includes("NetworkError")) {
          errorMessage =
            "Network error - please check your internet connection";
        } else if (err.message) {
          errorMessage = err.message;
        }

        setError(errorMessage);
      } finally {
        setLoading(false);
      }
    };

    fetchConcerts();
  }, []);

  const handleRetry = () => {
    setLoading(true);
    setError(null);
    // Trigger re-fetch by changing a dependency
    window.location.reload();
  };

  if (loading) {
    return (
      <div className="w-full pt-32 bg-gray-50 dark:bg-gray-700 min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-600 mx-auto mb-4"></div>
          <p className="text-lg text-gray-600 dark:text-gray-300">
            Loading concerts...
          </p>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-2">
            Connecting to: {BACKEND_URL}
          </p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="w-full pt-32 bg-gray-50 dark:bg-gray-700 min-h-screen flex items-center justify-center">
        <div className="text-center max-w-md mx-auto px-4">
          <div className="bg-red-100 dark:bg-red-900/20 p-6 rounded-lg">
            <h3 className="text-red-800 dark:text-red-400 text-lg font-semibold mb-2">
              Unable to Load Concerts
            </h3>
            <p className="text-red-600 dark:text-red-400 text-sm mb-4">
              {error}
            </p>
            <div className="space-y-2 text-xs text-gray-600 dark:text-gray-400 mb-4">
              <p>Backend URL: {BACKEND_URL || "Not configured"}</p>
              <p>Check if the server is running and accessible</p>
            </div>
            <button
              onClick={handleRetry}
              className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition duration-200"
            >
              Try Again
            </button>
          </div>
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
            <div className="bg-white dark:bg-gray-800 p-8 rounded-lg shadow-md">
              <p className="mb-4">No concerts found.</p>
              <p className="text-sm text-gray-400">
                Check back later for upcoming concerts!
              </p>
            </div>
          </div>
        ) : (
          concerts.map((concert) => (
            <div
              key={concert.id}
              className="bg-white dark:bg-gray-800 shadow-md rounded-2xl overflow-hidden hover:shadow-lg transition-shadow duration-200"
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
                  className="inline-block mt-3 px-4 py-2 bg-red-600 text-white rounded-lg font-semibold hover:bg-red-700 transition duration-200"
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
