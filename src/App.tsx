import React, { useState, useEffect } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import Navbar from "./components/Navbar";
import ProtectedRoute from "./components/ProtectedRoute";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";
import MovieDetail from "./pages/MovieDetail";
import SeatBooking from "./pages/SeatBooking";
import Payment from "./pages/Payment";
import Bookings from "./pages/Bookings";
import Footer from "./components/Footer";
import FAQs from "./components/FAQs";
import ContactUs from "./components/ContactUs";
import HelpCenter from "./components/HelpCenter";
import Concerts from "./components/Concerts";
import ConcertDetail from "./pages/ConcertDetail";
import Sports from "./components/Sports";
import TheatreAndArts from "./components/TheatresAndArts";
import OffersOnMovies from "./components/OffersOnMovies";
import NowShowing from "./components/NowShowing";
import ComingSoon from "./components/ComingSoon";
import Chatbot from "./components/Chatbot";
import LocationDropdownDemo from "./components/LocationDropdownDemo";

function App() {
  const [movies, setMovies] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchMovies = async () => {
      try {
        setLoading(true);
        setError(null);
        
        // Make sure we're using TMDB API
        const apiKey = import.meta.env.VITE_TMDB_API_KEY;
        
        if (!apiKey) {
          throw new Error("TMDB API key is not configured");
        }

        const response = await fetch(
          `https://api.themoviedb.org/3/movie/popular?api_key=${apiKey}&language=en-US&page=1`
        );

        if (!response.ok) {
          throw new Error(`TMDB API error: ${response.status} ${response.statusText}`);
        }

        const data = await response.json();
        
        if (!data.results) {
          throw new Error("Invalid response format from TMDB API");
        }

        const formattedMovies = data.results.map((movie: any) => ({
          id: movie.id,
          title: movie.title,
          poster: movie.poster_path
            ? `https://image.tmdb.org/t/p/w500${movie.poster_path}`
            : "",
          overview: movie.overview,
          rating: movie.vote_average,
          releaseDate: movie.release_date,
        }));

        setMovies(formattedMovies);
      } catch (err) {
        console.error("Error fetching movies:", err);
        setError(err instanceof Error ? err.message : "Failed to fetch movies");
      } finally {
        setLoading(false);
      }
    };

    fetchMovies();
  }, []);

  return (
    <AuthProvider>
      <Router>
        <div className="mt-0">
          <div className="min-h-screen bg-gray-50">
            <Navbar />
            <Routes>
              <Route path="/" element={<Home movies={movies} loading={loading} error={error} />} />
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              <Route path="/movie/:id" element={<MovieDetail />} />
              <Route
                path="/booking/:type/:id/:showTimeId"
                element={
                  <ProtectedRoute>
                    <SeatBooking />
                  </ProtectedRoute>
                }
              />
              <Route path="/concert/:id" element={<ConcertDetail />} />
              <Route
                path="/booking/theatre/:id/:showTimeId"
                element={
                  <ProtectedRoute>
                    <SeatBooking />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/payment/:bookingId"
                element={
                  <ProtectedRoute>
                    <Payment />
                  </ProtectedRoute>
                }
              />
              <Route path="/help" element={<HelpCenter />} />
              <Route
                path="/bookings"
                element={
                  <ProtectedRoute>
                    <Bookings />
                  </ProtectedRoute>
                }
              />
              <Route path="/faq" element={<FAQs />} />
              <Route path="/contact" element={<ContactUs />} />
              <Route path="/concerts" element={<Concerts />} />
              <Route path="/sports" element={<Sports />} />
              <Route path="/theatresandarts" element={<TheatreAndArts />} />
              <Route path="/offers" element={<OffersOnMovies />} />
              <Route path="/now-showing" element={<NowShowing />} />
              <Route path="/coming-soon" element={<ComingSoon />} />
              <Route
                path="/location-dropdown"
                element={<LocationDropdownDemo />}
              />
            </Routes>
            <Chatbot />
            <Footer />
          </div>
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;