import React, { useState, useRef, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  Film,
  User,
  LogOut,
  Ticket,
  Search,
  X,
  Clock,
  Star,
  MapPin,
  ChevronDown,
  Menu,
} from "lucide-react";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "../config/firebase";
import { useAuth } from "../context/AuthContext";
import { Movie, TmdbMovie } from "../types";
import { useTheme } from "../context/ThemeContext";

interface SearchResult {
  movie: Movie;
  matchType: "title" | "genre" | "cast" | "director" | "description";
  matchText: string;
}

interface Location {
  id: string;
  name: string;
  state: string;
  popular: boolean;
}

const locations: Location[] = [
  { id: "mumbai", name: "Mumbai", state: "Maharashtra", popular: true },
  { id: "delhi", name: "Delhi", state: "Delhi", popular: true },
  { id: "bangalore", name: "Bangalore", state: "Karnataka", popular: true },
  { id: "hyderabad", name: "Hyderabad", state: "Telangana", popular: true },
  { id: "chennai", name: "Chennai", state: "Tamil Nadu", popular: true },
  { id: "kolkata", name: "Kolkata", state: "West Bengal", popular: true },
  { id: "pune", name: "Pune", state: "Maharashtra", popular: true },
  { id: "ahmedabad", name: "Ahmedabad", state: "Gujarat", popular: true },
  { id: "jaipur", name: "Jaipur", state: "Rajasthan", popular: false },
  { id: "surat", name: "Surat", state: "Gujarat", popular: false },
  { id: "lucknow", name: "Lucknow", state: "Uttar Pradesh", popular: false },
  { id: "kanpur", name: "Kanpur", state: "Uttar Pradesh", popular: false },
  { id: "nagpur", name: "Nagpur", state: "Maharashtra", popular: false },
  { id: "indore", name: "Indore", state: "Madhya Pradesh", popular: false },
  { id: "thane", name: "Thane", state: "Maharashtra", popular: false },
  { id: "bhopal", name: "Bhopal", state: "Madhya Pradesh", popular: false },
  {
    id: "visakhapatnam",
    name: "Visakhapatnam",
    state: "Andhra Pradesh",
    popular: false,
  },
  {
    id: "pimpri",
    name: "Pimpri-Chinchwad",
    state: "Maharashtra",
    popular: false,
  },
  { id: "patna", name: "Patna", state: "Bihar", popular: false },
  { id: "vadodara", name: "Vadodara", state: "Gujarat", popular: false },
];

const Navbar: React.FC = () => {
  const { currentUser, logout } = useAuth();
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState("");
  const [movies, setMovies] = useState<Movie[]>([]);
  const [searchResults, setSearchResults] = useState<SearchResult[]>([]);
  const [isSearchFocused, setIsSearchFocused] = useState(false);
  const [showResults, setShowResults] = useState(false);
  const searchRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const locationRef = useRef<HTMLDivElement>(null);
  const mobileLocationRef = useRef<HTMLDivElement>(null);
  const { theme, toggleTheme } = useTheme();
  const [menuOpen, setMenuOpen] = useState(false);
  const [selectedLocation, setSelectedLocation] = useState(locations[0]);
  const [showLocationDropdown, setShowLocationDropdown] = useState(false);
  const [locationSearchQuery, setLocationSearchQuery] = useState("");

  const handleLogout = async () => {
    try {
      await logout();
      navigate("/");
    } catch (error) {
      console.error("Failed to log out", error);
    }
  };

  const performSearch = (query: string): SearchResult[] => {
    if (!query.trim()) return [];
    const searchTerm = query.toLowerCase().trim();
    const results: SearchResult[] = [];
    movies.forEach((movie) => {
      if (movie.title.toLowerCase().includes(searchTerm)) {
        results.push({ movie, matchType: "title", matchText: movie.title });
        return;
      }
      if (movie.genre.toLowerCase().includes(searchTerm)) {
        results.push({ movie, matchType: "genre", matchText: movie.genre });
        return;
      }
      const matchingCast = movie.cast.find((actor) =>
        actor.toLowerCase().includes(searchTerm)
      );
      if (matchingCast) {
        results.push({ movie, matchType: "cast", matchText: matchingCast });
        return;
      }
      if (movie.director.toLowerCase().includes(searchTerm)) {
        results.push({
          movie,
          matchType: "director",
          matchText: movie.director,
        });
        return;
      }
      if (movie.description.toLowerCase().includes(searchTerm)) {
        results.push({
          movie,
          matchType: "description",
          matchText: movie.description.substring(0, 100) + "...",
        });
      }
    });
    return results
      .sort((a, b) => {
        if (a.matchType === "title" && b.matchType !== "title") return -1;
        if (a.matchType !== "title" && b.matchType === "title") return 1;
        return b.movie.rating - a.movie.rating;
      })
      .slice(0, 6);
  };

  useEffect(() => {
    const results = performSearch(searchQuery);
    setSearchResults(results);
    setShowResults(
      searchQuery.length > 0 && (isSearchFocused || results.length > 0)
    );
  }, [searchQuery, isSearchFocused]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        searchRef.current &&
        !searchRef.current.contains(event.target as Node)
      ) {
        setShowResults(false);
        setIsSearchFocused(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as Node;
      if (
        (locationRef.current && locationRef.current.contains(target)) ||
        (mobileLocationRef.current &&
          mobileLocationRef.current.contains(target))
      ) {
        return;
      }

      setShowLocationDropdown(false);
      setLocationSearchQuery("");
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  useEffect(() => {
    const fetchMovies = async () => {
      try {
        // const response = await fetch(
        //   `https://api.themoviedb.org/3/movie/popular?api_key=4b450aa0778cebc4b83f126ec505068c&language=en-US&page=1`
        // );

        const backendUrl = import.meta.env.VITE_BACKEND_URL;
        const response = await fetch(`${backendUrl}/api/movies/popular`);

        const data = await response.json();
        const formattedMovies: Movie[] = data.results.map(
          (movie: TmdbMovie) => ({
            id: movie.id.toString(),
            title: movie.title,
            poster: movie.poster_path
              ? `https://image.tmdb.org/t/p/w500${movie.poster_path}`
              : "",
            rating: movie.vote_average,
            duration: 120,
            genre: "Action",
            cast: [],
            director: "",
            description: movie.overview,
          })
        );
        setMovies(formattedMovies);
      } catch (err) {
        console.error("Failed to fetch TMDB movies", err);
      }
    };

    fetchMovies();
  }, []);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/?search=${encodeURIComponent(searchQuery.trim())}`);
      setShowResults(false);
      setIsSearchFocused(false);
      inputRef.current?.blur();
    }
  };

  const handleResultClick = (movieId: string) => {
    navigate(`/movie/${movieId}`);
    setSearchQuery("");
    setShowResults(false);
    setIsSearchFocused(false);
    inputRef.current?.blur();
  };

  const clearSearch = () => {
    setSearchQuery("");
    setShowResults(false);
    inputRef.current?.focus();
  };

  const getMatchTypeLabel = (matchType: string) => {
    switch (matchType) {
      case "title":
        return "Movie";
      case "genre":
        return "Genre";
      case "cast":
        return "Actor";
      case "director":
        return "Director";
      case "description":
        return "Description";
      default:
        return "Match";
    }
  };

  const getMatchTypeColor = (matchType: string) => {
    switch (matchType) {
      case "title":
        return "bg-red-100 text-red-800";
      case "genre":
        return "bg-blue-100 text-blue-800";
      case "cast":
        return "bg-green-100 text-green-800";
      case "director":
        return "bg-purple-100 text-purple-800";
      case "description":
        return "bg-gray-100 text-gray-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const handleLocationSelect = (location: Location) => {
    setSelectedLocation(location);
    setShowLocationDropdown(false);
    setLocationSearchQuery("");
    console.log("Selected location:", location);
  };

  const filteredLocations = locations.filter(
    (location) =>
      location.name.toLowerCase().includes(locationSearchQuery.toLowerCase()) ||
      location.state.toLowerCase().includes(locationSearchQuery.toLowerCase())
  );

  const popularLocations = filteredLocations.filter((loc) => loc.popular);
  const otherLocations = filteredLocations.filter((loc) => !loc.popular);

  return (
    <nav className="fixed top-0 left-0 w-full h-auto bg-gray-900 text-white z-50 shadow-lg">
      <div className="max-w-7xl mx-auto px-4">
        <div className="hidden min-[1219px]:flex flex-col w-full py-2">
          <div className="flex flex-row flex-wrap items-center gap-2 w-full">
            <Link
              to="/"
              className="flex items-center gap-2 flex-shrink-0 min-w-0"
              style={{ maxWidth: "100vw" }}
            >
              <Film className="h-7 w-7 sm:h-8 sm:w-8 md:h-9 md:w-9 text-red-500 flex-shrink-0" />
              <span className="font-bold bg-gradient-to-r from-red-500 to-purple-600 bg-clip-text text-transparent whitespace-nowrap text-base sm:text-lg md:text-xl lg:text-2xl">
                SHOWTIMEGO
              </span>
            </Link>

            <div
              className="flex-1 min-w-0 mx-2 max-w-sm xl:max-w-md 2xl:max-w-lg relative"
              ref={searchRef}
            >
              <form onSubmit={handleSearchSubmit} className="relative">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                  <input
                    ref={inputRef}
                    type="text"
                    placeholder="Search movies, actors, directors..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    onFocus={() => setIsSearchFocused(true)}
                    className="w-full pl-10 pr-14 py-2 bg-gray-800 border border-gray-700 rounded-full text-white placeholder-gray-400 focus:ring-2 focus:ring-red-500 focus:border-transparent transition-all duration-200"
                  />
                  {searchQuery && (
                    <button
                      type="button"
                      onClick={clearSearch}
                      className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-white transition-colors"
                    >
                      <X className="h-5 w-5" />
                    </button>
                  )}
                </div>
              </form>

              {showResults && (
                <div className="absolute top-full left-0 right-0 mt-2 bg-white rounded-lg shadow-2xl border border-gray-200 max-h-96 overflow-y-auto z-50 min-w-[320px] w-full">
                  {searchResults.length > 0 ? (
                    <>
                      <div className="p-3 border-b border-gray-100">
                        <p className="text-sm text-gray-600">
                          Found {searchResults.length} result
                          {searchResults.length !== 1 ? "s" : ""} for "
                          {searchQuery}"
                        </p>
                      </div>
                      {searchResults.map((result, index) => (
                        <button
                          key={`${result.movie.id}-${index}`}
                          onClick={() => handleResultClick(result.movie.id)}
                          className="w-full p-4 hover:bg-gray-50 transition-colors text-left border-b border-gray-100 last:border-b-0"
                        >
                          <div className="flex items-start space-x-3">
                            <img
                              src={result.movie.poster}
                              alt={result.movie.title}
                              className="w-12 h-16 object-cover rounded"
                            />
                            <div className="flex-1 min-w-0">
                              <div className="flex items-center space-x-2 mb-1">
                                <h3 className="font-semibold text-gray-900 truncate">
                                  {result.movie.title}
                                </h3>
                                <span
                                  className={`px-2 py-0.5 rounded-full text-xs font-medium ${getMatchTypeColor(
                                    result.matchType
                                  )}`}
                                >
                                  {getMatchTypeLabel(result.matchType)}
                                </span>
                              </div>
                              <div className="flex items-center space-x-3 text-sm text-gray-600 mb-1">
                                <div className="flex items-center space-x-1">
                                  <Star className="h-3 w-3 text-yellow-500 fill-current" />
                                  <span>{result.movie.rating}</span>
                                </div>
                                <div className="flex items-center space-x-1">
                                  <Clock className="h-3 w-3" />
                                  <span>{result.movie.duration}m</span>
                                </div>
                                <span>{result.movie.genre.split(",")[0]}</span>
                              </div>
                            </div>
                          </div>
                        </button>
                      ))}
                    </>
                  ) : searchQuery.trim() ? (
                    <div className="p-6 text-center">
                      <Search className="h-8 w-8 text-gray-400 mx-auto mb-2" />
                      <p className="text-gray-600 mb-2">
                        No results found for "{searchQuery}"
                      </p>
                      <p className="text-sm text-gray-500">
                        Try searching for movie titles, actors, or genres
                      </p>
                    </div>
                  ) : (
                    <div className="p-6 text-center">
                      <Search className="h-8 w-8 text-gray-400 mx-auto mb-2" />
                      <p className="text-gray-600 mb-2">
                        Start typing to search
                      </p>
                      <p className="text-sm text-gray-500">
                        Search for movies, actors, directors, or genres
                      </p>
                    </div>
                  )}
                </div>
              )}
            </div>

            <div
              className="relative flex-shrink-0 w-36 xl:w-44 ml-2 z-50"
              ref={locationRef}
            >
              <button
                onClick={() => setShowLocationDropdown(!showLocationDropdown)}
                className="flex items-center space-x-2 px-3 py-2 bg-gray-800 hover:bg-gray-700 rounded-lg transition-colors border border-gray-700 w-full"
              >
                <MapPin className="h-4 w-4 text-red-500" />
                <span className="text-sm font-medium">
                  {selectedLocation ? selectedLocation.name : "Select Location"}
                </span>
                <ChevronDown
                  className={`h-4 w-4 transition-transform ${
                    showLocationDropdown ? "rotate-180" : ""
                  }`}
                />
              </button>
              {showLocationDropdown && (
                <div className="absolute top-full left-0 mt-2 min-w-0 w-full max-w-[500px] bg-white dark:bg-gray-900 rounded-lg shadow-2xl border border-gray-200 dark:border-gray-700 max-h-96 z-50">
                  <div className="p-3 border-b border-gray-100">
                    <div className="relative">
                      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                      <input
                        type="text"
                        placeholder="Search for your city"
                        value={locationSearchQuery}
                        onChange={(e) => setLocationSearchQuery(e.target.value)}
                        className="w-full pl-9 pr-3 py-2 border border-gray-300 rounded-lg text-gray-900 placeholder-gray-500 focus:ring-2 focus:ring-red-500 focus:border-transparent text-sm"
                      />
                    </div>
                  </div>
                  <div className="max-h-56 overflow-y-auto w-full">
                    {popularLocations.length > 0 && (
                      <div>
                        <div className="px-3 py-2 bg-gray-50 border-b border-gray-100">
                          <h3 className="text-xs font-semibold text-red-600 uppercase tracking-wide">
                            Popular Cities
                          </h3>
                        </div>
                        {popularLocations.map((location) => (
                          <button
                            key={location.id}
                            type="button"
                            onClick={() => handleLocationSelect(location)}
                            className={`w-full px-3 py-3 text-left transition-colors border-b border-gray-100 last:border-b-0 ${
                              String(selectedLocation.id) ===
                              String(location.id)
                                ? "bg-red-200"
                                : "bg-red-50 hover:bg-red-100"
                            }`}
                          >
                            <div className="flex items-center justify-between">
                              <div>
                                <div
                                  className={
                                    "font-medium " +
                                    (String(selectedLocation.id) ===
                                    String(location.id)
                                      ? "text-red-700 font-semibold"
                                      : "text-gray-900")
                                  }
                                >
                                  {location.name}
                                </div>
                                <div
                                  className={
                                    "text-sm " +
                                    (String(selectedLocation.id) ===
                                    String(location.id)
                                      ? "text-red-600"
                                      : "text-gray-500")
                                  }
                                >
                                  {location.state}
                                </div>
                              </div>
                              {String(selectedLocation.id) ===
                                String(location.id) && (
                                <div className="w-2 h-2 bg-red-500 rounded-full"></div>
                              )}
                            </div>
                          </button>
                        ))}
                      </div>
                    )}
                    {otherLocations.length > 0 && (
                      <div>
                        <div className="px-3 py-2 bg-gray-50 border-b border-gray-100">
                          <h3 className="text-xs font-semibold text-gray-600 uppercase tracking-wide">
                            Other Cities
                          </h3>
                        </div>
                        {otherLocations.map((location) => (
                          <button
                            key={location.id}
                            type="button"
                            onClick={() => handleLocationSelect(location)}
                            className={`w-full px-3 py-3 text-left transition-colors border-b border-gray-100 last:border-b-0 ${
                              String(selectedLocation.id) ===
                              String(location.id)
                                ? "bg-red-200"
                                : "bg-red-50 hover:bg-red-100"
                            }`}
                          >
                            <div className="flex items-center justify-between">
                              <div>
                                <div
                                  className={
                                    "font-medium " +
                                    (String(selectedLocation.id) ===
                                    String(location.id)
                                      ? "text-red-700 font-semibold"
                                      : "text-gray-900")
                                  }
                                >
                                  {location.name}
                                </div>
                                <div
                                  className={
                                    "text-sm " +
                                    (String(selectedLocation.id) ===
                                    String(location.id)
                                      ? "text-red-600"
                                      : "text-gray-500")
                                  }
                                >
                                  {location.state}
                                </div>
                              </div>
                              {String(selectedLocation.id) ===
                                String(location.id) && (
                                <div className="w-2 h-2 bg-red-500 rounded-full"></div>
                              )}
                            </div>
                          </button>
                        ))}
                      </div>
                    )}
                    {filteredLocations.length === 0 && locationSearchQuery && (
                      <div className="p-6 text-center">
                        <MapPin className="h-8 w-8 text-gray-400 mx-auto mb-2" />
                        <p className="text-gray-600 mb-2">No cities found</p>
                        <p className="text-sm text-gray-500">
                          Try searching with a different name
                        </p>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>

            <div className="flex flex-wrap items-center gap-2 ml-2">
              <Link
                to="/concerts"
                className="px-3 py-2 bg-gray-800 rounded-md text-white hover:bg-gray-700 transition-colors"
              >
                Concerts
              </Link>
              <Link
                to="/sports"
                className="px-3 py-2 bg-gray-800 rounded-md text-white hover:bg-gray-700 transition-colors"
              >
                Sports
              </Link>
              <Link
                to="/theatresandarts"
                className="px-3 py-2 bg-gray-800 rounded-md text-white hover:bg-gray-700 transition-colors"
              >
                Theatre & Arts
              </Link>
              <Link
                to="/bookings"
                className="px-3 py-2 bg-gray-800 rounded-md text-white hover:bg-gray-700 transition-colors flex items-center"
              >
                <Ticket className="h-5 w-5 mr-1" />
                <span>My Bookings</span>
              </Link>
              <Link
                to="/offers"
                className="px-3 py-2 bg-purple-700 rounded-md text-white hover:bg-purple-800 transition-colors"
              >
                Offers
              </Link>
            </div>

            <div className="flex items-center ml-2">
              <button
                onClick={toggleTheme}
                className="flex items-center gap-x-2 px-3 py-2 rounded-md bg-gray-200 dark:bg-gray-800 text-gray-900 dark:text-white text-sm font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-purple-400"
                aria-label="Toggle dark/light mode"
              >
                {theme === "light" ? (
                  <span className="flex items-center">
                    <span role="img" aria-label="moon">
                      🌙
                    </span>{" "}
                    Dark
                  </span>
                ) : (
                  <span className="flex items-center">
                    <span role="img" aria-label="sun">
                      ☀️
                    </span>{" "}
                    Light
                  </span>
                )}
              </button>
            </div>
          </div>

          <div className="flex items-center justify-end gap-x-4 mt-2 w-full">
            {currentUser ? (
              <>
                <div className="flex border-2 cursor-pointer dark:border-red-600 border-purple-600 rounded-lg p-2 items-center space-x-2">
                  <span className="text-lg text-white">
                    {/* {currentUser.displayName &&
                    currentUser.displayName.trim().length > 0
                      ? currentUser.displayName
                      : currentUser.email} */}
                    {/* Only show user icon when user is logged in AND email is verified */}
                    {currentUser && (
                      <div className="user-icon-container flex items-center space-x-2">
                        <User className="h-7 w-7 text-white" />
                        <span className="text-lg text-white">
                          {currentUser.displayName &&
                          currentUser.displayName.trim().length > 0
                            ? currentUser.displayName
                            : currentUser.email}
                        </span>
                      </div>
                    )}
                  </span>
                </div>
                <button
                  onClick={handleLogout}
                  className="flex items-center space-x-1 px-3 py-2 bg-red-600 hover:bg-red-700 rounded-md text-sm font-medium transition-colors"
                >
                  <LogOut className="h-4 w-4" />
                  <span className="hidden sm:inline">Logout</span>
                </button>
              </>
            ) : (
              <>
                <Link
                  to="/login"
                  className="px-2 md:px-3 xl:px-4 py-1.5 xl:py-2 text-sm md:text-base xl:text-lg bg-red-600 hover:bg-purple-600 text-white font-medium rounded-md transition-colors"
                >
                  Login
                </Link>
                <Link
                  to="/register"
                  className="px-2 md:px-3 xl:px-4 py-1.5 xl:py-2 text-sm md:text-base xl:text-lg bg-purple-600 hover:bg-red-600 text-white font-medium rounded-md transition-colors"
                >
                  Register
                </Link>
              </>
            )}
          </div>
        </div>

        <div className="flex max-[1218px]:flex min-[1219px]:hidden items-center w-full justify-between py-2">
          <Link
            to="/"
            className="flex items-center gap-2 flex-shrink-0 min-w-0"
            style={{ maxWidth: "100vw" }}
          >
            <Film className="h-7 w-7 sm:h-8 sm:w-8 md:h-9 md:w-9 text-red-500 flex-shrink-0" />
            <span className="font-bold bg-gradient-to-r from-red-500 to-purple-600 bg-clip-text text-transparent whitespace-nowrap text-base sm:text-lg md:text-xl lg:text-2xl">
              SHOWTIMEGO
            </span>
          </Link>
          <button
            onClick={() => setMenuOpen(!menuOpen)}
            className="p-2 focus:outline-none ml-auto"
          >
            <Menu className="h-7 w-7" />
          </button>
        </div>

        {menuOpen && (
          <div className="max-[1218px]:flex min-[1219px]:hidden absolute top-full left-0 right-0 bg-gray-900 rounded-b-lg shadow-lg z-50 flex flex-col gap-y-2 p-4 border-t border-gray-700">
            <div className="w-full mb-2 relative" ref={mobileLocationRef}>
              <button
                onClick={() => setShowLocationDropdown(!showLocationDropdown)}
                className="w-full flex items-center justify-between px-4 py-2 rounded-md bg-gray-800 hover:bg-gray-700 text-sm font-medium text-white border border-gray-700"
                type="button"
              >
                <span className="flex items-center gap-x-2">
                  <MapPin className="h-4 w-4 text-red-500" />

                  {selectedLocation ? selectedLocation.name : "Select Location"}
                </span>
                <ChevronDown
                  className={`h-4 w-4 transition-transform ${
                    showLocationDropdown ? "rotate-180" : ""
                  }`}
                />
              </button>
              {showLocationDropdown && (
                <div className="absolute top-full left-0 right-0 mt-2 min-w-0 w-full max-w-[500px] bg-white dark:bg-gray-900 rounded-lg shadow-2xl border border-gray-200 dark:border-gray-700 max-h-96 z-50">
                  <div className="p-3 border-b border-gray-100">
                    <div className="relative">
                      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                      <input
                        type="text"
                        placeholder="Search for your city"
                        value={locationSearchQuery}
                        onChange={(e) => setLocationSearchQuery(e.target.value)}
                        className="w-full pl-9 pr-3 py-2 border border-gray-300 rounded-lg text-gray-900 placeholder-gray-500 focus:ring-2 focus:ring-red-500 focus:border-transparent text-sm"
                      />
                    </div>
                  </div>
                  <div className="absolute top-full left-0 mt-2 min-w-0 w-full max-w-[500px] bg-white dark:bg-gray-900 rounded-lg shadow-2xl border border-gray-200 dark:border-gray-700 max-h-96 z-50">
                    <div className="max-h-56 overflow-y-auto w-full">
                      {popularLocations.length > 0 && (
                        <div>
                          <div className="px-3 py-2 bg-gray-50 border-b border-gray-100">
                            <h3 className="text-xs font-semibold text-red-600 uppercase tracking-wide">
                              Popular Cities
                            </h3>
                          </div>
                          {popularLocations.map((location) => (
                            <button
                              key={location.id}
                              type="button"
                              onClick={() => handleLocationSelect(location)}
                              className={`w-full px-3 py-3 text-left transition-colors border-b border-gray-100 last:border-b-0 ${
                                String(selectedLocation.id) ===
                                String(location.id)
                                  ? "bg-red-200"
                                  : "bg-red-50 hover:bg-red-100"
                              }`}
                            >
                              <div className="flex items-center justify-between">
                                <div>
                                  <div
                                    className={`font-medium ${
                                      String(selectedLocation.id) ===
                                      String(location.id)
                                        ? "text-red-700 font-semibold"
                                        : "text-gray-900"
                                    }`}
                                  >
                                    {location.name}
                                  </div>
                                  <div
                                    className={`text-sm ${
                                      String(selectedLocation.id) ===
                                      String(location.id)
                                        ? "text-red-600"
                                        : "text-gray-500"
                                    }`}
                                  >
                                    {location.state}
                                  </div>
                                </div>
                                {String(selectedLocation.id) ===
                                  String(location.id) && (
                                  <div className="w-2 h-2 bg-red-500 rounded-full"></div>
                                )}
                              </div>
                            </button>
                          ))}
                        </div>
                      )}
                      {otherLocations.length > 0 && (
                        <div>
                          <div className="px-3 py-2 bg-gray-50 border-b border-gray-100">
                            <h3 className="text-xs font-semibold text-gray-600 uppercase tracking-wide">
                              Other Cities
                            </h3>
                          </div>
                          {otherLocations.map((location) => (
                            <button
                              key={location.id}
                              type="button"
                              onClick={() => handleLocationSelect(location)}
                              className={`w-full px-3 py-3 text-left transition-colors border-b border-gray-100 last:border-b-0 ${
                                String(selectedLocation.id) ===
                                String(location.id)
                                  ? "bg-red-200"
                                  : "bg-red-50 hover:bg-red-100"
                              }`}
                            >
                              <div className="flex items-center justify-between">
                                <div>
                                  <div
                                    className={`font-medium ${
                                      String(selectedLocation.id) ===
                                      String(location.id)
                                        ? "text-red-700 font-semibold"
                                        : "text-gray-900"
                                    }`}
                                  >
                                    {location.name}
                                  </div>
                                  <div
                                    className={`text-sm ${
                                      String(selectedLocation.id) ===
                                      String(location.id)
                                        ? "text-red-600"
                                        : "text-gray-500"
                                    }`}
                                  >
                                    {location.state}
                                  </div>
                                </div>
                                {String(selectedLocation.id) ===
                                  String(location.id) && (
                                  <div className="w-2 h-2 bg-red-500 rounded-full"></div>
                                )}
                              </div>
                            </button>
                          ))}
                        </div>
                      )}
                      {filteredLocations.length === 0 &&
                        locationSearchQuery && (
                          <div className="p-6 text-center">
                            <MapPin className="h-8 w-8 text-gray-400 mx-auto mb-2" />
                            <p className="text-gray-600 mb-2">
                              No cities found
                            </p>
                            <p className="text-sm text-gray-500">
                              Try searching with a different name
                            </p>
                          </div>
                        )}
                    </div>
                  </div>
                </div>
              )}
            </div>

            <Link
              to="/bookings"
              className="w-full text-left px-4 py-2 rounded-md hover:bg-gray-800 transition-colors"
              onClick={() => setMenuOpen(false)}
            >
              My Bookings
            </Link>
            <Link
              to="/concerts"
              className="w-full text-left px-4 py-2 rounded-md hover:bg-gray-800 transition-colors"
              onClick={() => setMenuOpen(false)}
            >
              Concerts
            </Link>
            <Link
              to="/sports"
              className="w-full text-left px-4 py-2 rounded-md hover:bg-gray-800 transition-colors"
              onClick={() => setMenuOpen(false)}
            >
              Sports
            </Link>
            <Link
              to="/theatresandarts"
              className="w-full text-left px-4 py-2 rounded-md hover:bg-gray-800 transition-colors"
              onClick={() => setMenuOpen(false)}
            >
              Theatre & Arts
            </Link>
            <Link
              to="/offers"
              className="w-full text-left px-4 py-2 rounded-md bg-purple-700 text-white hover:bg-purple-800 transition-colors"
              onClick={() => setMenuOpen(false)}
            >
              Offers
            </Link>
            {!currentUser && (
              <>
                <Link
                  to="/login"
                  onClick={() => setMenuOpen(false)}
                  className="w-full text-left px-4 py-2 rounded-md bg-red-600 hover:bg-purple-600 text-white transition-colors"
                >
                  Login
                </Link>
                <Link
                  to="/register"
                  onClick={() => setMenuOpen(false)}
                  className="w-full text-left px-4 py-2 rounded-md bg-purple-600 hover:bg-red-600 text-white transition-colors"
                >
                  Register
                </Link>
              </>
            )}
            <button
              onClick={toggleTheme}
              className="w-full flex items-center gap-x-2 px-4 py-2 mt-2 rounded-md bg-gray-800 text-white text-base font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-purple-400"
              aria-label="Toggle light/dark mode"
            >
              {theme === "light" ? (
                <>
                  <span role="img" aria-label="moon">
                    🌙
                  </span>
                  Dark Theme
                </>
              ) : (
                <>
                  <span role="img" aria-label="sun">
                    ☀️
                  </span>
                  Light Theme
                </>
              )}
            </button>
            {currentUser && (
              <button
                onClick={() => {
                  handleLogout();
                  setMenuOpen(false);
                }}
                className="w-full flex items-center gap-x-2 px-4 py-2 mt-2 rounded-md bg-red-600 hover:bg-red-700 text-white text-base font-medium transition-colors focus:outline-none"
              >
                <LogOut className="h-5 w-5" />
                Logout
              </button>
            )}
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
