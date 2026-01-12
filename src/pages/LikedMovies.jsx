import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { getLikedMovies } from '../api/api';
import { fetchLikedMoviesSuccess } from '../store/slices/movieSlice';
import MovieCard from '../components/MovieCard';

const LikedMovies = () => {
  const { likedMovies } = useSelector((state) => state.movie);
  const { token } = useSelector((state) => state.user);
  const dispatch = useDispatch();

  useEffect(() => {
    const fetchLikedMovies = async () => {
      try {
        const { data } = await getLikedMovies(token);
        dispatch(fetchLikedMoviesSuccess(data.data));
      } catch (err) {
        console.error(err);
      }
    };
    if (token) fetchLikedMovies();
  }, [token, dispatch]);

  return (
    <div>
      <h1>My Liked Movies</h1>
      <div className="movie-grid">
        {likedMovies.map((movie) => (
          <MovieCard key={movie._id} movieId={movie.movieId} />
        ))}
      </div>
    </div>
  );
};

export default LikedMovies;
