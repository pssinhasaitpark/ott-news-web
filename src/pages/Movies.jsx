import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useSearchParams } from "react-router-dom";
import { getMovies, getLikedMovies, getSavedMovies } from "../api/api";
import {
  fetchMoviesSuccess,
  fetchLikedMoviesSuccess,
  fetchSavedMoviesSuccess,
} from "../store/slices/movieSlice";
import MovieCard from "../components/MovieCard";
import Navbar from "../components/Navbar";
import Loading from "../components/Loading";
import ErrorBoundary from "../components/ErrorBoundary";
import "./Movies.css";

const Movies = () => {
  const { movies, totalPages, currentPage } = useSelector(
    (state) => state.movie
  );
  const { token } = useSelector((state) => state.user);

  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [filters, setFilters] = useState({
    language: "hi",
    year: "2025",
    genre: searchParams.get("genre") || "",
    vote: "",
    country: "IN",
    sort: "popularity.desc",
  });


  const fetchMovies = async (page = 1) => {
  try {
    setLoading(page === 1);
    setError(null);

    const { data } = await getMovies({
      ...filters,
      page,
    });

    dispatch(fetchMoviesSuccess(data));
  } catch (err) {
    setError("Failed to fetch movies");
  } finally {
    if (page === 1) setLoading(false);
  }
};

useEffect(() => {
  fetchMovies(1);
}, [filters]);



  useEffect(() => {
    const fetchLikedAndSavedMovies = async () => {
      if (!token) return;
      try {
        const likedResponse = await getLikedMovies(token);
        dispatch(fetchLikedMoviesSuccess(likedResponse.data.data || []));

        const savedResponse = await getSavedMovies(token);
        dispatch(fetchSavedMoviesSuccess(savedResponse.data.data || []));
      } catch (err) {
        console.error("Error fetching liked/saved movies:", err);
      }
    };

    if (token) {
      fetchLikedAndSavedMovies();
    }
  }, [token, dispatch]);

  const paginate = (page) => {
    if (page >= 1 && page <= totalPages) {
      fetchMovies(page);
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  const renderPaginationButtons = () => {
    const buttons = [];
    const maxVisiblePages = 5;
    let startPage = Math.max(1, currentPage - 2);
    let endPage = Math.min(totalPages, startPage + maxVisiblePages - 1);

    if (endPage - startPage < maxVisiblePages - 1) {
      startPage = Math.max(1, endPage - maxVisiblePages + 1);
    }

    if (startPage > 1) {
      buttons.push(
        <button key={1} className="page-btn" onClick={() => paginate(1)}>
          1
        </button>
      );
      if (startPage > 2) {
        buttons.push(
          <span key="dots1" className="pagination-dots">
            ...
          </span>
        );
      }
    }

    for (let i = startPage; i <= endPage; i++) {
      buttons.push(
        <button
          key={i}
          className={`page-btn ${currentPage === i ? "active" : ""}`}
          onClick={() => paginate(i)}
        >
          {i}
        </button>
      );
    }

    if (endPage < totalPages) {
      if (endPage < totalPages - 1) {
        buttons.push(
          <span key="dots2" className="pagination-dots">
            ...
          </span>
        );
      }
      buttons.push(
        <button
          key={totalPages}
          className="page-btn"
          onClick={() => paginate(totalPages)}
        >
          {totalPages}
        </button>
      );
    }

    return buttons;
  };

  if (error) {
    return (
      <div className="movies-container">
        <Navbar />
        <div className="error-message">{error}</div>
      </div>
    );
  }

  return (
    <ErrorBoundary>
      <div className="movies-container">
        <Navbar />

        <h1 className="page-title">Discover Movies</h1>

        <div className="filters-bar">
          <select
            value={filters.language}
            onChange={(e) =>
              setFilters({ ...filters, language: e.target.value })
            }
          >
            <option value="hi">Hindi</option>
            <option value="en">English</option>
            <option value="ta">Tamil</option>
            <option value="te">Telugu</option>
            <option value="ml">Malayalam</option>
          </select>

          <select
            value={filters.year}
            onChange={(e) => setFilters({ ...filters, year: e.target.value })}
          >
            <option value="">All Years</option>
            <option value="2025">2025</option>
            <option value="2024">2024</option>
            <option value="2023">2023</option>
            <option value="2022">2022</option>
            <option value="2021">2021</option>
          </select>

          <select
            value={filters.genre}
            onChange={(e) => setFilters({ ...filters, genre: e.target.value })}
          >
            <option value="">All Genres</option>
            <option value="28">Action</option>
            <option value="35">Comedy</option>
            <option value="18">Drama</option>
            <option value="27">Horror</option>
            <option value="10749">Romance</option>
            <option value="878">Sci-Fi</option>
            <option value="53">Thriller</option>
          </select>

          <select
            value={filters.vote}
            onChange={(e) => setFilters({ ...filters, vote: e.target.value })}
          >
            <option value="">All Ratings</option>
            <option value="8">8+</option>
            <option value="7">7+</option>
            <option value="6">6+</option>
            <option value="5">5+</option>
          </select>

          <select
            value={filters.sort}
            onChange={(e) => setFilters({ ...filters, sort: e.target.value })}
          >
            <option value="popularity.desc">Most Popular</option>
            <option value="vote_average.desc">Top Rated</option>
            <option value="release_date.desc">Latest Release</option>
            <option value="revenue.desc">Highest Grossing</option>
          </select>
        </div>

        {loading && currentPage === 1 ? (
          <Loading />
        ) : (
          <>
            {movies.length === 0 ? (
              <div className="no-results">
                <h2>No movies found</h2>
                <p>Try adjusting your filters</p>
              </div>
            ) : (
              <div className="movie-grid">
                {movies.slice(0, 18).map((movie) => (
                  <MovieCard key={movie.id} movie={movie} />
                ))}
              </div>
            )}

            {totalPages > 1 && (
              <div className="pagination">
                <button
                  className="page-btn nav-btn"
                  disabled={currentPage === 1}
                  onClick={() => paginate(currentPage - 1)}
                >
                  ← Previous
                </button>

                {renderPaginationButtons()}

                <button
                  className="page-btn nav-btn"
                  disabled={currentPage === totalPages}
                  onClick={() => paginate(currentPage + 1)}
                >
                  Next →
                </button>
              </div>
            )}
          </>
        )}
      </div>
    </ErrorBoundary>
  );
};

export default Movies;
