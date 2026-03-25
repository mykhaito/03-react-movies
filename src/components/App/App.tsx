import { useEffect, useState } from "react";
import { keepPreviousData, useQuery } from "@tanstack/react-query";
import ReactPaginate from "react-paginate";
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
  const [page, setPage] = useState(1);
  const [selectedMovie, setSelectedMovie] = useState<Movie | null>(null);

  const { data, isError, isPending, isSuccess } = useQuery({
    queryKey: ["movies", query, page],
    queryFn: () => fetchMovies(query, page),
    enabled: query.trim() !== "",
    placeholderData: keepPreviousData,
  });

  useEffect(() => {
    if (isSuccess && data.results.length === 0) {
      toast.error("No movies found for your request.");
    }
  }, [data, isSuccess]);

  const handleSearch = (newQuery: string) => {
    setQuery(newQuery);
    setPage(1);
    setSelectedMovie(null);
  };

  const handleSelectMovie = (movie: Movie) => {
    setSelectedMovie(movie);
  };

  const handleCloseModal = () => {
    setSelectedMovie(null);
  };

  const handlePageChange = ({ selected }: { selected: number }) => {
    setPage(selected + 1);
    setSelectedMovie(null);
  };

  return (
    <div className={css.app}>
      <SearchBar onSubmit={handleSearch} />

      {isPending && <Loader />}
      {isError && <ErrorMessage />}

      {!isPending && !isError && data && data.results.length > 0 && (
        <>
          <MovieGrid movies={data.results} onSelect={handleSelectMovie} />

          {data.total_pages > 1 && (
            <ReactPaginate
              pageCount={data.total_pages}
              pageRangeDisplayed={5}
              marginPagesDisplayed={1}
              onPageChange={handlePageChange}
              forcePage={page - 1}
              containerClassName={css.pagination}
              pageClassName={css.pageItem}
              pageLinkClassName={css.pageLink}
              previousClassName={css.pageItem}
              previousLinkClassName={css.pageLink}
              nextClassName={css.pageItem}
              nextLinkClassName={css.pageLink}
              breakClassName={css.pageItem}
              breakLinkClassName={css.pageLink}
              activeClassName={css.active}
              disabledClassName={css.disabled}
              previousLabel="<"
              nextLabel=">"
            />
          )}
        </>
      )}

      {selectedMovie && (
        <MovieModal movie={selectedMovie} onClose={handleCloseModal} />
      )}
    </div>
  );
}