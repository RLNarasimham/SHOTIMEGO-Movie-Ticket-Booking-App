// import React, { useState, useEffect } from "react";
// import { useParams, useNavigate } from "react-router-dom";
// import { ArrowLeft, CreditCard, MapPin, Clock } from "lucide-react";
// import { useAuth } from "../context/AuthContext";
// import { Seat, Movie, ShowTime, TmdbMovieDetail } from "../types";
// import { db } from "../config/firebase";
// import { doc, setDoc, onSnapshot } from "firebase/firestore";

// const backendURL = import.meta.env.VITE_BACKEND_URL;

// const SeatBooking: React.FC = () => {
//   const params = useParams();
//   let { type, id, showTimeId } = params;

//   if (!type) {
//     const match = window.location.pathname.match(/^\/booking\/([^/]+)/);
//     if (match) {
//       type = match[1];
//     }
//   }

//   console.log("SeatBooking params:", type, id, showTimeId);
//   const navigate = useNavigate();
//   const { currentUser } = useAuth();

//   const [seats, setSeats] = useState<Seat[]>([]);
//   const [selectedSeats, setSelectedSeats] = useState<string[]>([]);
//   const [movie, setMovie] = useState<Movie | null>(null);
//   const [showTimes, setShowTimes] = useState<ShowTime[]>([]);
//   const [loadingMovie, setLoadingMovie] = useState(true);
//   const [loadingSeats, setLoadingSeats] = useState(true);
//   const [error, setError] = useState<string | null>(null);

//   useEffect(() => {
//     if (!id) return;

//     const load = async () => {
//       setLoadingMovie(true);
//       setError(null);

//       try {
//         let data: any;

//         if (type === "movie") {
//           const res = await fetch(
//             `https://api.themoviedb.org/3/movie/${id}?api_key=${
//               import.meta.env.VITE_TMDB_API_KEY
//             }&language=en-US`
//           );
//           if (!res.ok) throw new Error("Movie not found");
//           data = await res.json();

//           const creditsRes = await fetch(
//             `https://api.themoviedb.org/3/movie/${id}/credits?api_key=${
//               import.meta.env.VITE_TMDB_API_KEY
//             }`
//           );
//           const credits = await creditsRes.json();
//           const directorMember = credits.crew.find(
//             (m: any) => m.job === "Director"
//           );
//           data.director = directorMember?.name || "";
//           data.cast = credits.cast.slice(0, 5).map((m: any) => m.name);
//         } else if (type === "sports") {
//           const res = await fetch(`http://localhost:5000/api/sports/${id}`);
//           if (!res.ok) throw new Error("Sport event not found");
//           data = await res.json();
//           data.director = "";
//           data.cast = [];
//         } else if (type === "concert") {
//           const res = await fetch(`http://localhost:5000/api/concerts/${id}`);
//           if (!res.ok) throw new Error("Concert not found");
//           data = await res.json();
//           data.director = "";
//           data.cast = [];
//         } else if (type === "theatre") {
//           const res = await fetch(
//             `http://localhost:5000/api/theatre-arts/${id}`
//           );
//           if (!res.ok) throw new Error("Theatre/Art event not found");
//           data = await res.json();

//           const mockShowTimes: ShowTime[] = [
//             {
//               id: "st1",
//               time: "7:00 PM",
//               date: data.date || "2025-09-05",
//               theater: data.location || "Grand Theatre",
//               screen: "Main Stage",
//               price: 350,
//             },
//             {
//               id: "st2",
//               time: "9:00 PM",
//               date: data.date || "2025-09-05",
//               theater: data.location || "Grand Theatre",
//               screen: "Main Stage",
//               price: 350,
//             },
//           ];

//           setMovie({
//             id: data.id != null ? String(data.id) : "",
//             title: data.title || "",
//             poster: data.image || "",
//             rating: "",
//             duration: 120,
//             genre: data.type || "Theatre",
//             cast: [],
//             director: "",
//             description: "",
//             releaseDate: data.date || "",
//             language: "EN",
//             showTimes: mockShowTimes,
//           });
//           setShowTimes(mockShowTimes);
//           setLoadingMovie(false);
//           return;
//         } else {
//           throw new Error("Invalid type");
//         }

//         console.log("🎬 load() got data:", data);

//         const mockShowTimes: ShowTime[] = [
//           {
//             id: "st1",
//             time: "10:00 AM",
//             date: "2025-07-22",
//             theater: "PVR City Mall",
//             screen: "Screen 1",
//             price: 250,
//           },
//           {
//             id: "st2",
//             time: "1:00 PM",
//             date: "2025-07-22",
//             theater: "PVR City Mall",
//             screen: "Screen 2",
//             price: 250,
//           },
//           {
//             id: "st3",
//             time: "6:00 PM",
//             date: "2025-07-22",
//             theater: "PVR City Mall",
//             screen: "Screen 3",
//             price: 300,
//           },
//           {
//             id: "st4",
//             time: "9:00 PM",
//             date: "2025-07-22",
//             theater: "INOX GVK Mall",
//             screen: "Screen 1",
//             price: 350,
//           },
//         ];

//         setMovie({
//           id: data.id != null ? String(data.id) : "",
//           title: data.title || data.name || "",
//           poster: data.poster_path
//             ? `https://image.tmdb.org/t/p/w500${data.poster_path}`
//             : data.image || "",
//           rating: data.vote_average ?? "",
//           duration: data.runtime ?? 0,
//           genre: Array.isArray(data.genres)
//             ? data.genres.map((g: any) => g.name).join(", ")
//             : data.category || "N/A",
//           cast: Array.isArray(data.cast) ? data.cast : [],
//           director: data.director || "",
//           description: data.overview || data.description || "",
//           releaseDate: data.release_date || data.date || "",
//           language: data.original_language || data.language || "",
//           showTimes: mockShowTimes,
//         });
//         setShowTimes(mockShowTimes);
//       } catch (err: any) {
//         console.error("SeatBooking load error:", err);
//         setError(err.message || "Unknown error");
//       } finally {
//         setLoadingMovie(false);
//       }
//     };

//     load();
//   }, [type, id]);

//   const showTime = showTimes.find((st) => st.id === showTimeId);

//   useEffect(() => {
//     console.log("id:", id, "showTimeId:", showTimeId, "showTime:", showTime);

//     if (!id || !showTimeId || !showTime) return;

//     setLoadingSeats(true);

//     const bookingDocRef = doc(db, "bookings", `${id}_${showTimeId}`);
//     const unsubscribe = onSnapshot(bookingDocRef, (bookingSnap) => {
//       let bookedSeats: string[] = [];
//       if (bookingSnap.exists()) {
//         bookedSeats = bookingSnap.data().bookedSeats || [];
//       }

//       const rows = ["A", "B", "C", "D", "E", "F", "G", "H"];
//       const seatLayout: Seat[] = rows.flatMap((row) => {
//         const seatsPerRow = row <= "C" ? 8 : row <= "F" ? 10 : 12;
//         const seatType =
//           row <= "C" ? "vip" : row <= "F" ? "premium" : "regular";
//         const basePrice = showTime.price || 250;
//         const seatPrice =
//           seatType === "vip"
//             ? basePrice * 1.5
//             : seatType === "premium"
//             ? basePrice * 1.2
//             : basePrice;

//         return Array.from({ length: seatsPerRow }, (_, i) => {
//           const id = `${row}${i + 1}`;
//           return {
//             id,
//             row,
//             number: i + 1,
//             type: seatType,
//             price: Math.round(seatPrice),
//             isBooked: bookedSeats.includes(id),
//             isSelected: false,
//           } as Seat;
//         });
//       });

//       setSeats(seatLayout);
//       setLoadingSeats(false);
//     });

//     return () => unsubscribe();
//   }, [id, showTimeId, showTime]);

//   const toggleSeat = (seatId: string) => {
//     const seat = seats.find((s) => s.id === seatId);
//     if (!seat || seat.isBooked) return;

//     setSelectedSeats((prev) =>
//       prev.includes(seatId)
//         ? prev.filter((id) => id !== seatId)
//         : [...prev, seatId]
//     );
//   };

//   const getTotalAmount = () => {
//     return selectedSeats.reduce((total, seatId) => {
//       const seat = seats.find((s) => s.id === seatId);
//       return total + (seat?.price || 0) + 59;
//     }, 0);
//   };

//   const handleProceedToPayment = async () => {
//     if (selectedSeats.length === 0 || !currentUser) return;

//     try {
//       const bookingId = `booking_${currentUser.uid}_${Date.now()}`;

//       const pendingBookingRef = doc(db, "pendingBookings", bookingId);

//       const bookingData = {
//         bookingId,
//         userId: currentUser.uid,
//         movieId: id!,
//         showDate: showTime!.date,
//         showTimeId: showTimeId!,
//         movieTitle: movie!.title,
//         showTime: showTime!.time,
//         theater: showTime!.theater,
//         selectedSeats: selectedSeats,
//         totalAmount: getTotalAmount(),
//         seats: selectedSeats.map((seatId) => {
//           const seat = seats.find((s) => s.id === seatId);
//           return {
//             id: seatId,
//             type: seat?.type || "regular",
//             price: seat?.price || 0,
//           };
//         }),
//         status: "pending",
//         createdAt: new Date(),
//         expiresAt: new Date(Date.now() + 15 * 60 * 1000),
//       };

//       await setDoc(pendingBookingRef, bookingData);

//       navigate(`/payment/${bookingId}`);
//     } catch (error) {
//       console.error("Failed to create booking:", error);
//       alert("Failed to proceed to payment. Please try again.");
//     }
//   };

//   if (loadingMovie) {
//     return (
//       <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
//         <div className="text-center text-gray-500 dark:text-gray-300 text-lg font-medium">
//           Loading movie details...
//         </div>
//       </div>
//     );
//   }
//   if (error) {
//     return (
//       <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center px-4">
//         <div className="text-center text-red-600 dark:text-red-400 text-lg font-medium">
//           {error}
//         </div>
//       </div>
//     );
//   }

//   if (!movie || !showTime) {
//     return (
//       <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center px-4">
//         <div className="text-center">
//           <h2 className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white mb-4">
//             {!movie ? "Movie Not Found" : "Showtime Not Found"}
//           </h2>
//           <p className="text-gray-600 dark:text-gray-300 mb-4 text-sm sm:text-base">
//             {!movie
//               ? "The requested movie could not be found."
//               : "The requested showtime is not available."}
//           </p>
//           <button
//             onClick={() => navigate("/")}
//             className="text-red-600 dark:text-red-400 hover:text-red-700 dark:hover:text-red-300 font-semibold"
//           >
//             Return to Home
//           </button>
//         </div>
//       </div>
//     );
//   }

//   if (loadingSeats) {
//     return (
//       <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
//         <div className="text-center text-gray-500 dark:text-gray-300 text-lg font-medium">
//           Loading seat availability...
//         </div>
//       </div>
//     );
//   }

//   const groupedSeats = seats.reduce((acc, seat) => {
//     if (!acc[seat.row]) acc[seat.row] = [];
//     acc[seat.row].push(seat);
//     return acc;
//   }, {} as Record<string, Seat[]>);

// return (
//   <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
//     <div className="bg-white dark:bg-black shadow-sm">
//       <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
//         <button
//           onClick={() => navigate(-1)}
//           className="inline-flex items-center space-x-2 text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white transition-colors"
//         >
//           <ArrowLeft className="h-5 w-5 flex-shrink-0" />
//           <span>Back</span>
//         </button>
//       </div>
//     </div>

//     <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-8">
//       <div className="flex flex-col lg:grid lg:grid-cols-3 lg:gap-8 gap-4 space-y-6 lg:space-y-0">
//         <div className="lg:col-span-2 order-2 lg:order-1">
//           <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-4 sm:p-6">
//             <div className="text-center mb-6 sm:mb-8">
//               <h1 className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white mb-2">
//                 Select Your Seats
//               </h1>
//               <div className="flex flex-col sm:flex-row sm:items-center sm:justify-center sm:space-x-6 space-y-2 sm:space-y-0 text-sm text-gray-600 dark:text-gray-300">
//                 <div className="flex items-center justify-center space-x-1">
//                   <MapPin className="h-4 w-4 flex-shrink-0" />
//                   <span className="truncate">{showTime.theater}</span>
//                 </div>
//                 <div className="flex items-center justify-center space-x-1">
//                   <Clock className="h-4 w-4 flex-shrink-0" />
//                   <span>{showTime.time}</span>
//                 </div>
//               </div>
//             </div>

//             {!currentUser && (
//               <div className="text-center text-red-600 dark:text-red-400 mb-4 font-semibold text-sm sm:text-base">
//                 Please log in to book seats.
//               </div>
//             )}

//             <div className="mb-6 sm:mb-8">
//               <div className="bg-gradient-to-r from-gray-300 to-gray-400 dark:from-gray-700 dark:to-gray-800 h-2 rounded-full mx-auto w-3/4 mb-2"></div>
//               <div className="text-center text-sm text-gray-600 dark:text-gray-300">
//                 SCREEN
//               </div>
//             </div>

//             <div className="space-y-3 sm:space-y-4 mb-6 sm:mb-8 overflow-x-auto">
//               <div className="min-w-max mx-auto">
//                 {Object.entries(groupedSeats).map(([row, rowSeats]) => (
//                   <div
//                     key={row}
//                     className="flex items-center justify-center space-x-1 sm:space-x-2 mb-2"
//                   >
//                     <div className="w-6 sm:w-8 text-center dark:text-white font-semibold text-gray-700 text-sm sm:text-base flex-shrink-0">
//                       {row}
//                     </div>
//                     <div className="flex space-x-1">
//                       {rowSeats.map((seat) => (
//                         <button
//                           key={seat.id}
//                           onClick={() => toggleSeat(seat.id)}
//                           disabled={seat.isBooked || !currentUser}
//                           className={`
//                             w-6 h-6 sm:w-8 sm:h-8 rounded-t-lg text-xs font-semibold transition-all duration-200 flex-shrink-0
//                             ${
//                               seat.isBooked
//                                 ? "bg-gray-400 text-white cursor-not-allowed"
//                                 : selectedSeats.includes(seat.id)
//                                 ? "bg-red-600 text-white transform scale-110 shadow-lg"
//                                 : seat.type === "vip"
//                                 ? "bg-yellow-200 text-yellow-800 hover:bg-yellow-300"
//                                 : seat.type === "premium"
//                                 ? "bg-blue-200 text-blue-800 hover:bg-blue-300"
//                                 : "bg-green-200 text-green-800 hover:bg-green-300"
//                             }
//                             ${
//                               !currentUser
//                                 ? "opacity-50 cursor-not-allowed"
//                                 : ""
//                             }
//                           `}
//                         >
//                           {seat.number}
//                         </button>
//                       ))}
//                     </div>
//                   </div>
//                 ))}
//               </div>
//             </div>

//             <div className="grid grid-cols-2 sm:flex sm:items-center sm:justify-center gap-3 sm:gap-6 dark:text-white text-black text-xs sm:text-sm">
//               <div className="flex items-center space-x-2">
//                 <div className="w-3 h-3 sm:w-4 sm:h-4 bg-green-200 rounded-t flex-shrink-0"></div>
//                 <span className="truncate">Regular (₹{showTime.price})</span>
//               </div>
//               <div className="flex items-center space-x-2">
//                 <div className="w-3 h-3 sm:w-4 sm:h-4 bg-blue-200 rounded-t flex-shrink-0"></div>
//                 <span className="truncate">
//                   Premium (₹{Math.round(showTime.price * 1.2)})
//                 </span>
//               </div>
//               <div className="flex items-center space-x-2">
//                 <div className="w-3 h-3 sm:w-4 sm:h-4 bg-yellow-200 rounded-t flex-shrink-0"></div>
//                 <span className="truncate">
//                   VIP (₹{Math.round(showTime.price * 1.5)})
//                 </span>
//               </div>
//               <div className="flex items-center space-x-2">
//                 <div className="w-3 h-3 sm:w-4 sm:h-4 bg-red-600 rounded-t flex-shrink-0"></div>
//                 <span>Selected</span>
//               </div>
//               <div className="flex items-center space-x-2 col-span-2 sm:col-span-1 justify-center sm:justify-start">
//                 <div className="w-3 h-3 sm:w-4 sm:h-4 bg-gray-400 rounded-t flex-shrink-0"></div>
//                 <span>Booked</span>
//               </div>
//             </div>
//           </div>
//         </div>

//         <div className="lg:col-span-1 order-1 lg:order-2 sm:py-5">
//           <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg  p-4 sm:p-6 lg:sticky lg:top-8">
//             <h2 className="text-lg sm:text-xl font-bold text-gray-900 dark:text-white mb-4">
//               Booking Summary
//             </h2>

//             <div className="space-y-3 mb-6">
//               <div>
//                 <h3 className="font-semibold text-gray-900 dark:text-white text-sm sm:text-base break-words">
//                   {movie.title}
//                 </h3>
//                 <p className="text-sm text-gray-600 dark:text-gray-300">
//                   {movie.genre}
//                 </p>
//               </div>

//               <div className="text-sm text-gray-600 dark:text-gray-300">
//                 <div className="flex justify-between items-start">
//                   <span className="flex-shrink-0">Theater:</span>
//                   <span className="text-right break-words ml-2">
//                     {showTime.theater}
//                   </span>
//                 </div>
//                 <div className="flex justify-between">
//                   <span>Show Time:</span>
//                   <span>{showTime.time}</span>
//                 </div>
//                 <div className="flex justify-between">
//                   <span>Date:</span>
//                   <span>{showTime.date}</span>
//                 </div>
//               </div>
//             </div>

//             {selectedSeats.length > 0 && (
//               <div className="border-t border-gray-200 dark:border-gray-700 pt-4 mb-6">
//                 <h4 className="font-semibold text-gray-900 dark:text-white mb-2 text-sm sm:text-base">
//                   Selected Seats
//                 </h4>
//                 <div className="space-y-2 max-h-32 overflow-y-auto">
//                   {selectedSeats.map((seatId) => {
//                     const seat = seats.find((s) => s.id === seatId);
//                     return (
//                       <div
//                         key={seatId}
//                         className="flex justify-between dark:text-white text-black text-sm"
//                       >
//                         <span className="break-words">
//                           {seatId} ({seat?.type})
//                         </span>
//                         <span className="flex-shrink-0 ml-2">
//                           ₹{seat?.price}
//                         </span>
//                       </div>
//                     );
//                   })}
//                 </div>
//               </div>
//             )}

//             <div className="border-t border-gray-200 dark:border-gray-700 pt-4 mb-6">
//               <h4 className="font-semibold text-gray-900 dark:text-white mb-2 text-sm sm:text-base">
//                 Convenience Fees
//               </h4>
//               <div className="flex dark:text-white text-black justify-between text-sm">
//                 <span>Fee:</span>
//                 <span>₹ 59.00</span>
//               </div>
//             </div>

//             <div className="border-t border-gray-200 dark:border-gray-700 pt-4">
//               <div className="flex justify-between text-lg font-bold text-gray-900 dark:text-white mb-4">
//                 <span>Total: </span>
//                 <span>₹ {getTotalAmount()}</span>
//               </div>

//               <button
//                 onClick={handleProceedToPayment}
//                 disabled={selectedSeats.length === 0 || !currentUser}
//                 className="w-full bg-red-600 hover:bg-red-700 disabled:bg-gray-400 dark:disabled:bg-gray-700 text-white font-semibold py-3 rounded-lg transition-colors flex items-center justify-center space-x-2 text-sm sm:text-base"
//               >
//                 <CreditCard className="h-4 w-4 sm:h-5 sm:w-5 flex-shrink-0" />
//                 <span className="truncate">
//                   {!currentUser
//                     ? "Login to Book"
//                     : selectedSeats.length === 0
//                     ? "Select Seats"
//                     : `Proceed to Payment ${
//                         selectedSeats.length > 0
//                           ? `(${selectedSeats.length} ${
//                               selectedSeats.length === 1 ? "seat" : "seats"
//                             })`
//                           : ""
//                       }`}
//                 </span>
//               </button>
//             </div>
//           </div>
//         </div>
//       </div>
//     </div>
//   </div>
// );
// };

// export default SeatBooking;

import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { ArrowLeft, CreditCard, MapPin, Clock } from "lucide-react";
import { useAuth } from "../context/AuthContext";
import { Seat, Movie, ShowTime } from "../types";
import { db } from "../config/firebase";
import { doc, setDoc, onSnapshot } from "firebase/firestore";

const backendURL = import.meta.env.VITE_BACKEND_URL;

const SeatBooking: React.FC = () => {
  const params = useParams();
  let { type, id, showTimeId } = params;

  if (!type) {
    const match = window.location.pathname.match(/^\/booking\/([^/]+)/);
    if (match) {
      type = match[1];
    }
  }

  const navigate = useNavigate();
  const { currentUser } = useAuth();

  const [seats, setSeats] = useState<Seat[]>([]);
  const [selectedSeats, setSelectedSeats] = useState<string[]>([]);
  const [movie, setMovie] = useState<Movie | null>(null);
  const [showTimes, setShowTimes] = useState<ShowTime[]>([]);
  const [loadingMovie, setLoadingMovie] = useState(true);
  const [loadingSeats, setLoadingSeats] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch event details (movie, sports, concert, or theatre)
  useEffect(() => {
    if (!id) return;

    const load = async () => {
      setLoadingMovie(true);
      setError(null);

      try {
        let data: any;

        // Movie details from TMDB API
        if (type === "movie") {
          const res = await fetch(
            `https://api.themoviedb.org/3/movie/${id}?api_key=${
              import.meta.env.VITE_TMDB_API_KEY
            }&language=en-US`
          );
          if (!res.ok) throw new Error("Movie not found");
          data = await res.json();

          const creditsRes = await fetch(
            `https://api.themoviedb.org/3/movie/${id}/credits?api_key=${
              import.meta.env.VITE_TMDB_API_KEY
            }`
          );
          const credits = await creditsRes.json();
          const directorMember = credits.crew.find(
            (m: any) => m.job === "Director"
          );
          data.director = directorMember?.name || "";
          data.cast = credits.cast.slice(0, 5).map((m: any) => m.name);
        }
        // Sports event details from your backend
        else if (type === "sports") {
          const res = await fetch(`${backendURL}/api/sports/${id}`);
          if (!res.ok) throw new Error("Sport event not found");
          const apiData = await res.json();
          data = apiData.data;
          data.director = "";
          data.cast = [];
        }
        // Concert details from your backend
        else if (type === "concert") {
          const res = await fetch(`${backendURL}/api/concerts/${id}`);
          if (!res.ok) throw new Error("Concert not found");
          const apiData = await res.json();
          data = apiData.data;
          data.director = "";
          data.cast = [];
        }
        // Theatre/Arts event details from your backend
        else if (type === "theatre") {
          const res = await fetch(`${backendURL}/api/theatre-arts/${id}`);
          if (!res.ok) throw new Error("Theatre/Art event not found");
          const apiData = await res.json();
          data = apiData.data;

          // Mock show times for demo purpose
          const mockShowTimes: ShowTime[] = [
            {
              id: "st1",
              time: "7:00 PM",
              date: data.date || "2025-09-05",
              theater: data.location || "Grand Theatre",
              screen: "Main Stage",
              price: 350,
            },
            {
              id: "st2",
              time: "9:00 PM",
              date: data.date || "2025-09-05",
              theater: data.location || "Grand Theatre",
              screen: "Main Stage",
              price: 350,
            },
          ];

          setMovie({
            id: data.id != null ? String(data.id) : "",
            title: data.title || "",
            poster: data.image || "",
            rating: "",
            duration: 120,
            genre: data.type || "Theatre",
            cast: [],
            director: "",
            description: "",
            releaseDate: data.date || "",
            language: "EN",
            showTimes: mockShowTimes,
          });
          setShowTimes(mockShowTimes);
          setLoadingMovie(false);
          return;
        } else {
          throw new Error("Invalid type");
        }

        // For movie, sports, concert (set mock showtimes for demo)
        const mockShowTimes: ShowTime[] = [
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
          {
            id: "st4",
            time: "9:00 PM",
            date: "2025-07-22",
            theater: "INOX GVK Mall",
            screen: "Screen 1",
            price: 350,
          },
        ];

        setMovie({
          id: data.id != null ? String(data.id) : "",
          title: data.title || data.name || "",
          poster: data.poster_path
            ? `https://image.tmdb.org/t/p/w500${data.poster_path}`
            : data.image || "",
          rating: data.vote_average ?? "",
          duration: data.runtime ?? 0,
          genre: Array.isArray(data.genres)
            ? data.genres.map((g: any) => g.name).join(", ")
            : data.category || "N/A",
          cast: Array.isArray(data.cast) ? data.cast : [],
          director: data.director || "",
          description: data.overview || data.description || "",
          releaseDate: data.release_date || data.date || "",
          language: data.original_language || data.language || "",
          showTimes: mockShowTimes,
        });
        setShowTimes(mockShowTimes);
      } catch (err: any) {
        setError(err.message || "Unknown error");
      } finally {
        setLoadingMovie(false);
      }
    };

    load();
  }, [type, id]);

  const showTime = showTimes.find((st) => st.id === showTimeId);

  useEffect(() => {
    if (!id || !showTimeId || !showTime) return;
    setLoadingSeats(true);

    const bookingDocRef = doc(db, "bookings", `${id}_${showTimeId}`);
    const unsubscribe = onSnapshot(bookingDocRef, (bookingSnap) => {
      let bookedSeats: string[] = [];
      if (bookingSnap.exists()) {
        bookedSeats = bookingSnap.data().bookedSeats || [];
      }

      const rows = ["A", "B", "C", "D", "E", "F", "G", "H"];
      const seatLayout: Seat[] = rows.flatMap((row) => {
        const seatsPerRow = row <= "C" ? 8 : row <= "F" ? 10 : 12;
        const seatType =
          row <= "C" ? "vip" : row <= "F" ? "premium" : "regular";
        const basePrice = showTime.price || 250;
        const seatPrice =
          seatType === "vip"
            ? basePrice * 1.5
            : seatType === "premium"
            ? basePrice * 1.2
            : basePrice;

        return Array.from({ length: seatsPerRow }, (_, i) => {
          const seatId = `${row}${i + 1}`;
          return {
            id: seatId,
            row,
            number: i + 1,
            type: seatType,
            price: Math.round(seatPrice),
            isBooked: bookedSeats.includes(seatId),
            isSelected: false,
          } as Seat;
        });
      });

      setSeats(seatLayout);
      setLoadingSeats(false);
    });

    return () => unsubscribe();
  }, [id, showTimeId, showTime]);

  const toggleSeat = (seatId: string) => {
    const seat = seats.find((s) => s.id === seatId);
    if (!seat || seat.isBooked) return;

    setSelectedSeats((prev) =>
      prev.includes(seatId)
        ? prev.filter((id) => id !== seatId)
        : [...prev, seatId]
    );
  };

  const getTotalAmount = () => {
    return selectedSeats.reduce((total, seatId) => {
      const seat = seats.find((s) => s.id === seatId);
      return total + (seat?.price || 0) + 59;
    }, 0);
  };

  const handleProceedToPayment = async () => {
    if (selectedSeats.length === 0 || !currentUser) return;

    try {
      const bookingId = `booking_${currentUser.uid}_${Date.now()}`;
      const pendingBookingRef = doc(db, "pendingBookings", bookingId);

      const bookingData = {
        bookingId,
        userId: currentUser.uid,
        movieId: id!,
        showDate: showTime!.date,
        showTimeId: showTimeId!,
        movieTitle: movie!.title,
        showTime: showTime!.time,
        theater: showTime!.theater,
        selectedSeats: selectedSeats,
        totalAmount: getTotalAmount(),
        seats: selectedSeats.map((seatId) => {
          const seat = seats.find((s) => s.id === seatId);
          return {
            id: seatId,
            type: seat?.type || "regular",
            price: seat?.price || 0,
          };
        }),
        status: "pending",
        createdAt: new Date(),
        expiresAt: new Date(Date.now() + 15 * 60 * 1000),
      };

      await setDoc(pendingBookingRef, bookingData);
      navigate(`/payment/${bookingId}`);
    } catch (error) {
      alert("Failed to proceed to payment. Please try again.");
    }
  };

  // ...Your full UI rendering block here (unchanged)...
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="bg-white dark:bg-black shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <button
            onClick={() => navigate(-1)}
            className="inline-flex items-center space-x-2 text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white transition-colors"
          >
            <ArrowLeft className="h-5 w-5 flex-shrink-0" />
            <span>Back</span>
          </button>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-8">
        <div className="flex flex-col lg:grid lg:grid-cols-3 lg:gap-8 gap-4 space-y-6 lg:space-y-0">
          <div className="lg:col-span-2 order-2 lg:order-1">
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-4 sm:p-6">
              <div className="text-center mb-6 sm:mb-8">
                <h1 className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white mb-2">
                  Select Your Seats
                </h1>
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-center sm:space-x-6 space-y-2 sm:space-y-0 text-sm text-gray-600 dark:text-gray-300">
                  <div className="flex items-center justify-center space-x-1">
                    <MapPin className="h-4 w-4 flex-shrink-0" />
                    <span className="truncate">{showTime.theater}</span>
                  </div>
                  <div className="flex items-center justify-center space-x-1">
                    <Clock className="h-4 w-4 flex-shrink-0" />
                    <span>{showTime.time}</span>
                  </div>
                </div>
              </div>

              {!currentUser && (
                <div className="text-center text-red-600 dark:text-red-400 mb-4 font-semibold text-sm sm:text-base">
                  Please log in to book seats.
                </div>
              )}

              <div className="mb-6 sm:mb-8">
                <div className="bg-gradient-to-r from-gray-300 to-gray-400 dark:from-gray-700 dark:to-gray-800 h-2 rounded-full mx-auto w-3/4 mb-2"></div>
                <div className="text-center text-sm text-gray-600 dark:text-gray-300">
                  SCREEN
                </div>
              </div>

              <div className="space-y-3 sm:space-y-4 mb-6 sm:mb-8 overflow-x-auto">
                <div className="min-w-max mx-auto">
                  {Object.entries(groupedSeats).map(([row, rowSeats]) => (
                    <div
                      key={row}
                      className="flex items-center justify-center space-x-1 sm:space-x-2 mb-2"
                    >
                      <div className="w-6 sm:w-8 text-center dark:text-white font-semibold text-gray-700 text-sm sm:text-base flex-shrink-0">
                        {row}
                      </div>
                      <div className="flex space-x-1">
                        {rowSeats.map((seat) => (
                          <button
                            key={seat.id}
                            onClick={() => toggleSeat(seat.id)}
                            disabled={seat.isBooked || !currentUser}
                            className={`
                              w-6 h-6 sm:w-8 sm:h-8 rounded-t-lg text-xs font-semibold transition-all duration-200 flex-shrink-0
                              ${
                                seat.isBooked
                                  ? "bg-gray-400 text-white cursor-not-allowed"
                                  : selectedSeats.includes(seat.id)
                                  ? "bg-red-600 text-white transform scale-110 shadow-lg"
                                  : seat.type === "vip"
                                  ? "bg-yellow-200 text-yellow-800 hover:bg-yellow-300"
                                  : seat.type === "premium"
                                  ? "bg-blue-200 text-blue-800 hover:bg-blue-300"
                                  : "bg-green-200 text-green-800 hover:bg-green-300"
                              }
                              ${
                                !currentUser
                                  ? "opacity-50 cursor-not-allowed"
                                  : ""
                              }
                            `}
                          >
                            {seat.number}
                          </button>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="grid grid-cols-2 sm:flex sm:items-center sm:justify-center gap-3 sm:gap-6 dark:text-white text-black text-xs sm:text-sm">
                <div className="flex items-center space-x-2">
                  <div className="w-3 h-3 sm:w-4 sm:h-4 bg-green-200 rounded-t flex-shrink-0"></div>
                  <span className="truncate">Regular (₹{showTime.price})</span>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="w-3 h-3 sm:w-4 sm:h-4 bg-blue-200 rounded-t flex-shrink-0"></div>
                  <span className="truncate">
                    Premium (₹{Math.round(showTime.price * 1.2)})
                  </span>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="w-3 h-3 sm:w-4 sm:h-4 bg-yellow-200 rounded-t flex-shrink-0"></div>
                  <span className="truncate">
                    VIP (₹{Math.round(showTime.price * 1.5)})
                  </span>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="w-3 h-3 sm:w-4 sm:h-4 bg-red-600 rounded-t flex-shrink-0"></div>
                  <span>Selected</span>
                </div>
                <div className="flex items-center space-x-2 col-span-2 sm:col-span-1 justify-center sm:justify-start">
                  <div className="w-3 h-3 sm:w-4 sm:h-4 bg-gray-400 rounded-t flex-shrink-0"></div>
                  <span>Booked</span>
                </div>
              </div>
            </div>
          </div>

          <div className="lg:col-span-1 order-1 lg:order-2 sm:py-5">
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg  p-4 sm:p-6 lg:sticky lg:top-8">
              <h2 className="text-lg sm:text-xl font-bold text-gray-900 dark:text-white mb-4">
                Booking Summary
              </h2>

              <div className="space-y-3 mb-6">
                <div>
                  <h3 className="font-semibold text-gray-900 dark:text-white text-sm sm:text-base break-words">
                    {movie.title}
                  </h3>
                  <p className="text-sm text-gray-600 dark:text-gray-300">
                    {movie.genre}
                  </p>
                </div>

                <div className="text-sm text-gray-600 dark:text-gray-300">
                  <div className="flex justify-between items-start">
                    <span className="flex-shrink-0">Theater:</span>
                    <span className="text-right break-words ml-2">
                      {showTime.theater}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span>Show Time:</span>
                    <span>{showTime.time}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Date:</span>
                    <span>{showTime.date}</span>
                  </div>
                </div>
              </div>

              {selectedSeats.length > 0 && (
                <div className="border-t border-gray-200 dark:border-gray-700 pt-4 mb-6">
                  <h4 className="font-semibold text-gray-900 dark:text-white mb-2 text-sm sm:text-base">
                    Selected Seats
                  </h4>
                  <div className="space-y-2 max-h-32 overflow-y-auto">
                    {selectedSeats.map((seatId) => {
                      const seat = seats.find((s) => s.id === seatId);
                      return (
                        <div
                          key={seatId}
                          className="flex justify-between dark:text-white text-black text-sm"
                        >
                          <span className="break-words">
                            {seatId} ({seat?.type})
                          </span>
                          <span className="flex-shrink-0 ml-2">
                            ₹{seat?.price}
                          </span>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}

              <div className="border-t border-gray-200 dark:border-gray-700 pt-4 mb-6">
                <h4 className="font-semibold text-gray-900 dark:text-white mb-2 text-sm sm:text-base">
                  Convenience Fees
                </h4>
                <div className="flex dark:text-white text-black justify-between text-sm">
                  <span>Fee:</span>
                  <span>₹ 59.00</span>
                </div>
              </div>

              <div className="border-t border-gray-200 dark:border-gray-700 pt-4">
                <div className="flex justify-between text-lg font-bold text-gray-900 dark:text-white mb-4">
                  <span>Total: </span>
                  <span>₹ {getTotalAmount()}</span>
                </div>

                <button
                  onClick={handleProceedToPayment}
                  disabled={selectedSeats.length === 0 || !currentUser}
                  className="w-full bg-red-600 hover:bg-red-700 disabled:bg-gray-400 dark:disabled:bg-gray-700 text-white font-semibold py-3 rounded-lg transition-colors flex items-center justify-center space-x-2 text-sm sm:text-base"
                >
                  <CreditCard className="h-4 w-4 sm:h-5 sm:w-5 flex-shrink-0" />
                  <span className="truncate">
                    {!currentUser
                      ? "Login to Book"
                      : selectedSeats.length === 0
                      ? "Select Seats"
                      : `Proceed to Payment ${
                          selectedSeats.length > 0
                            ? `(${selectedSeats.length} ${
                                selectedSeats.length === 1 ? "seat" : "seats"
                              })`
                            : ""
                        }`}
                  </span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SeatBooking;
