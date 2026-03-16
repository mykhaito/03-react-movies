import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import css from "./App.module.css";
import SearchBar from "../SearchBar/SearchBar";
import MovieGrid from "../MovieGrid/MovieGrid";
import Loader from "../Loader/Loader";
import ErrorMessage from "../ErrorMessage/ErrorMessage";
import MovieModal from "../MovieModal/MovieModal";
import { fetchMovies } from "../../services/movieService";
import type { Movie } from "../../types/movie";

export default function App() {
  const [query, setQuery] = useState("");
  const [movies, setMovies] = useState<Movie[]>([]);
  const [selectedMovie, setSelectedMovie] = useState<Movie | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isError, setIsError] = useState(false);

  const handleSearch = (newQuery: string) => {
    setQuery(newQuery);
    setMovies([]);
    setSelectedMovie(null);
    setIsError(false);
  };

  const handleSelectMovie = (movie: Movie) => {
    setSelectedMovie(movie);
  };

  const handleCloseModal = () => {
    setSelectedMovie(null);
  };

  useEffect(() => {
    if (!query) {
      return;
    }

    const getMovies = async () => {
      try {
        setIsLoading(true);
        setIsError(false);

        const data = await fetchMovies(query);
        setMovies(data);

        if (data.length === 0) {
          toast.error("No movies found for your request.");
        }
      } catch {
        setIsError(true);
      } finally {
        setIsLoading(false);
      }
    };

    getMovies();
  }, [query]);

  return (
    <div className={css.app}>
      <SearchBar onSubmit={handleSearch} />
      {isLoading && <Loader />}
      {isError && <ErrorMessage />}
      {!isLoading && !isError && movies.length > 0 && (
        <MovieGrid movies={movies} onSelect={handleSelectMovie} />
      )}
      {selectedMovie && (
        <MovieModal movie={selectedMovie} onClose={handleCloseModal} />
      )}
    </div>
  );
}