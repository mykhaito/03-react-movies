import axios from "axios";
import type { Movie } from "../types/movie";

export interface FetchMoviesResponse {
  results: Movie[];
  total_pages: number;
}

const token = import.meta.env.VITE_TMDB_TOKEN;

export async function fetchMovies(
  query: string,
  page: number
): Promise<FetchMoviesResponse> {
  if (!token) {
    throw new Error("TMDB token is missing");
  }

  const response = await axios.get<FetchMoviesResponse>(
    "https://api.themoviedb.org/3/search/movie",
    {
      params: {
        query,
        page,
      },
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );

  return response.data;
}