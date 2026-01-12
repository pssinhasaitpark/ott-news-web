import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { getSavedMovies } from '../api/api';
import { fetchSavedMoviesSuccess } from '../store/slices/movieSlice';
import MovieCard from '../components/MovieCard';

const SavedMovies = () => {
  const { savedMovies } = useSelector((state) => state.movie);
  const { token } = useSelector((state) => state.user);
  const dispatch = useDispatch();

  useEffect(() => {
    const fetchSavedMovies = async () => {
      try {
        const { data } = await getSavedMovies(token);
        dispatch(fetchSavedMoviesSuccess(data.data));
      } catch (err) {
        console.error(err);
      }
    };
    if (token) fetchSavedMovies();
  }, [token, dispatch]);

  return (
    <div>
      <h1>My Saved Movies</h1>
      <div className="movie-grid">
        {savedMovies.map((movie) => (
          <MovieCard key={movie._id} movieId={movie.movieId} />
        ))}
      </div>
    </div>
  );
};

export default SavedMovies;