export interface User {
  uid: string;
  email: string;
  displayName: string;
  emailVerified: boolean;
}

export interface TmdbMovie {
  id: number;
  title: string;
  poster_path: string | null;
  overview: string;
  vote_average: number;
  release_date: string;
}

export interface ShowTime {
  id: string;
  date: string;
  time: string;
  theater: string;
  screen: string;
  price: number;
}

export interface Movie {
  id: string;
  title: string;
  poster: string;
  rating: number;
  duration: number;
  genre: string;
  cast: string[];
  director: string;
  description: string;
  releaseDate: string;
  language: string;
  showTimes: ShowTime[]; 
}

export interface TmdbCredits {
  cast: TmdbCastMember[];
  crew: TmdbCrewMember[];
}

export interface TmdbCastMember {
  id: number;
  name: string;
  character: string;
  profile_path: string | null;
 
}

export interface TmdbCrewMember {
  id: number;
  name: string;
  job: string;
  department: string;
  profile_path: string | null;
  
}

export interface TmdbMovieDetail {
  id: number;
  title: string;
  poster_path: string | null;
  overview: string;
  vote_average: number;
  release_date: string;
  original_language: string;
  runtime: number;
  genres: { id: number; name: string }[];
}