import css from './App.module.css';
import SearchBar from '../SearchBar/SearchBar';
import { useState, useEffect } from 'react';
import fetchMovies from '../../services/movieService';
import type { Movie } from '../../types/movie';
import toast from 'react-hot-toast';
import MovieGrid from '../MovieGrid/MovieGrid';
import Loader from '../Loader/Loader';
import ErrorMessage from '../ErrorMessage/ErrorMessage';
import MovieModal from '../MovieModal/MovieModal';
import ReactPaginate from 'react-paginate';
import { useQuery } from '@tanstack/react-query';

export default function App() {
  const [query, setQuery] = useState('');
  const [page, setPage] = useState(1);
  const [selectedMovie, setSelectedMovie] = useState<Movie | null>(null);

  const token = import.meta.env.VITE_TMDB_TOKEN;

  const { data, isLoading, isError, isSuccess } = useQuery({
    queryKey: ['movies', query, page],
    queryFn: () => fetchMovies(query, token, page),
    enabled: query.trim() !== '',
    placeholderData: (prev) => prev,
  });

  useEffect(() => {
    if (isSuccess && data?.results.length === 0) {
      toast.error('No movies found for your request.');
    }
  }, [isSuccess, data]);
  

  const handleSearch = (newQuery: string) => {
    setQuery(newQuery);
    setPage(1);
  };

  const changePage = ({ selected }: { selected: number }) => {
    setPage(selected + 1);
  };

  const totalPages = data?.total_pages ?? 0;

  return (
    <div className={css.app}>
      <SearchBar onSubmit={handleSearch} />

      {isSuccess && totalPages > 1 && (
        <ReactPaginate
          pageCount={totalPages}
          pageRangeDisplayed={5}
          marginPagesDisplayed={1}
          onPageChange={changePage}
          forcePage={page - 1}
          nextLabel="→"
          previousLabel="←"
          containerClassName={css.pagination}
          activeClassName={css.active}
        />
      )}

      {isLoading && <Loader />}
      {isError && <ErrorMessage />}
      {data && data.results.length > 0 && (
        <MovieGrid movies={data.results} onSelect={setSelectedMovie} />
      )}

      {selectedMovie && (
        <MovieModal movie={selectedMovie} onClose={() => setSelectedMovie(null)} />
      )}
    </div>
  );
}
