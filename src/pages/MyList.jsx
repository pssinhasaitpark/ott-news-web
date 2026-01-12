import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {  getLikedMovies,  getSavedMovies,  getMovieDetails,  getLikedTVShows,  getSavedTVShows,  getTVShowDetails,} from "../api/api";
import {  fetchLikedMoviesSuccess,  fetchSavedMoviesSuccess,} from "../store/slices/movieSlice";
import {  fetchLikedTVSuccess,  fetchSavedTVSuccess,} from "../store/slices/tvSlice";
import MovieCard from "../components/MovieCard";
import TVShowCard from "../components/TVShowCard";
import Navbar from "../components/Navbar";
import Loading from "../components/Loading";
import "./MyList.css";

const MyList = () => {
  const dispatch = useDispatch();

  const { token } = useSelector((state) => state.user);
  const { likedMovies, savedMovies } = useSelector((state) => state.movie);
  const { likedTVShows, savedTVShows } = useSelector((state) => state.tv);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [likedMoviesDetails, setLikedMoviesDetails] = useState([]);
  const [savedMoviesDetails, setSavedMoviesDetails] = useState([]);
  const [likedTVDetails, setLikedTVDetails] = useState([]);
  const [savedTVDetails, setSavedTVDetails] = useState([]);

  useEffect(() => {
    if (!token) return;

    const fetchMyList = async () => {
      try {
        setLoading(true);

        const likedMoviesRes = await getLikedMovies(token);
        const likedMovieIds = likedMoviesRes.data.data || [];
        dispatch(fetchLikedMoviesSuccess(likedMovieIds));

        const likedMoviesData = await Promise.all(
          likedMovieIds.map(async (id) => {
            try {
              const res = await getMovieDetails(id);
              return res.data;
            } catch {
              return null;
            }
          })
        );
        setLikedMoviesDetails(likedMoviesData.filter(Boolean));

        const savedMoviesRes = await getSavedMovies(token);
        const savedMovieIds = savedMoviesRes.data.data || [];
        dispatch(fetchSavedMoviesSuccess(savedMovieIds));

        const savedMoviesData = await Promise.all(
          savedMovieIds.map(async (id) => {
            try {
              const res = await getMovieDetails(id);
              return res.data;
            } catch {
              return null;
            }
          })
        );
        setSavedMoviesDetails(savedMoviesData.filter(Boolean));

        const likedTVRes = await getLikedTVShows(token);
        const likedTVIds = likedTVRes.data.data || [];
        dispatch(fetchLikedTVSuccess(likedTVIds));

        const likedTVData = await Promise.all(
          likedTVIds.map(async (id) => {
            try {
              const res = await getTVShowDetails(id);
              return res.data;
            } catch {
              return null;
            }
          })
        );
        setLikedTVDetails(likedTVData.filter(Boolean));

        const savedTVRes = await getSavedTVShows(token);
        const savedTVIds = savedTVRes.data.data || [];
        dispatch(fetchSavedTVSuccess(savedTVIds));

        const savedTVData = await Promise.all(
          savedTVIds.map(async (id) => {
            try {
              const res = await getTVShowDetails(id);
              return res.data;
            } catch {
              return null;
            }
          })
        );
        setSavedTVDetails(savedTVData.filter(Boolean));

        setError(null);
      } catch (err) {
        setError("Failed to fetch your list");
      } finally {
        setLoading(false);
      }
    };

    fetchMyList();
  }, [token, dispatch]);

  useEffect(() => {
    setLikedMoviesDetails((prev) =>
      prev.filter((movie) => likedMovies.includes(movie.id))
    );
  }, [likedMovies]);

  useEffect(() => {
    setSavedMoviesDetails((prev) =>
      prev.filter((movie) => savedMovies.includes(movie.id))
    );
  }, [savedMovies]);

  useEffect(() => {
    setLikedTVDetails((prev) =>
      prev.filter((tv) => likedTVShows.includes(tv.id))
    );
  }, [likedTVShows]);

  useEffect(() => {
    setSavedTVDetails((prev) =>
      prev.filter((tv) => savedTVShows.includes(tv.id))
    );
  }, [savedTVShows]);

  if (!token) {
    return (
      <div className="mylist-container">
        <Navbar />
      </div>
    );
  }

  if (loading) {
    return (
      <div className="mylist-container">
        <Navbar />
        <Loading />
      </div>
    );
  }

  if (error) {
    return (
      <div className="mylist-container">
        <Navbar />
        <div className="error-message">{error}</div>
      </div>
    );
  }

  return (
    <div className="mylist-container">
      <Navbar />
      <h1 className="page-title">My List</h1>

      <div className="mylist-content">
        <div className="mylist-section">
          <h2>❤️ Liked Movies <span className="count-badge">{likedMoviesDetails.length}</span></h2>
          {likedMoviesDetails.length ? (
            <div className="movie-grid">
              {likedMoviesDetails.map((movie) => (
                <MovieCard key={movie.id} movie={movie} />
              ))}
            </div>
          ) : (
            <p>No liked movies</p>
          )}
        </div>

        <div className="mylist-section">
          <h2>🔖 Saved Movies <span className="count-badge">{savedMoviesDetails.length}</span></h2>
          {savedMoviesDetails.length ? (
            <div className="movie-grid">
              {savedMoviesDetails.map((movie) => (
                <MovieCard key={movie.id} movie={movie} />
              ))}
            </div>
          ) : (
            <p>No saved movies</p>
          )}
        </div>

        <div className="mylist-section">
          <h2>❤️ Liked TV Shows <span className="count-badge">{likedTVDetails.length}</span></h2>
          {likedTVDetails.length ? (
            <div className="movie-grid">
              {likedTVDetails.map((tv) => (
                <TVShowCard key={tv.id} tvShow={tv} />
              ))}
            </div>
          ) : (
            <p>No liked TV shows</p>
          )}
        </div>

        <div className="mylist-section">
          <h2>🔖 Saved TV Shows <span className="count-badge">{savedTVDetails.length}</span></h2>
          {savedTVDetails.length ? (
            <div className="movie-grid">
              {savedTVDetails.map((tv) => (
                <TVShowCard key={tv.id} tvShow={tv} />
              ))}
            </div>
          ) : (
            <p>No saved TV shows</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default MyList;
