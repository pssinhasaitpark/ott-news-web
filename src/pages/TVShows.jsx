import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { getTVShows } from "../api/api";
import { fetchTVShowsSuccess } from "../store/slices/tvSlice";
import TVShowCard from "../components/TVShowCard";
import Navbar from "../components/Navbar";
import Loading from "../components/Loading";
import "./TVShows.css";

const TVShows = () => {
  const { tvShows, totalPages, currentPage } = useSelector((state) => state.tv);
  const { token } = useSelector((state) => state.user);

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [filters, setFilters] = useState({
    language: "hi",
    year: "2025",
    genre: "",
    vote: "",
    country: "IN",
    sort: "popularity.desc",
    provider: "",
  });

  const fetchTVShows = async (page = 1) => {
  try {
    setLoading(true);

    const { data } = await getTVShows(
      token || null,
      { ...filters, page }
    );

    dispatch(fetchTVShowsSuccess(data));
    setError(null);
  } catch (err) {
    setError(err.response?.data?.message || "Failed to fetch TV shows");
  } finally {
    setLoading(false);
  }
};


  useEffect(() => {
    fetchTVShows(1);
  }, [filters]);

  const paginate = (page) => {
    if (page >= 1 && page <= totalPages) {
      fetchTVShows(page);
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
        buttons.push(<span key="dots1" className="pagination-dots">...</span>);
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
        buttons.push(<span key="dots2" className="pagination-dots">...</span>);
      }
      buttons.push(
        <button key={totalPages} className="page-btn" onClick={() => paginate(totalPages)}>
          {totalPages}
        </button>
      );
    }

    return buttons;
  };

  if (loading && currentPage === 1) {
    return (
      <div className="tvshows-container">
        <Navbar />
        <Loading />
      </div>
    );
  }

  if (error) {
    return (
      <div className="tvshows-container">
        <Navbar />
        <div className="error-message">{error}</div>
      </div>
    );
  }

  return (
    <div className="tvshows-container">
      <Navbar />

      <h1 className="page-title">TV Shows</h1>

      <div className="filters-bar">
        <select 
          value={filters.language}
          onChange={(e) => setFilters({ ...filters, language: e.target.value })}
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
          <option value="10759">Action & Adventure</option>
          <option value="35">Comedy</option>
          <option value="18">Drama</option>
          <option value="10765">Sci-Fi & Fantasy</option>
          <option value="9648">Mystery</option>
          <option value="80">Crime</option>
        </select>

        <select 
          value={filters.sort}
          onChange={(e) => setFilters({ ...filters, sort: e.target.value })}
        >
          <option value="popularity.desc">Most Popular</option>
          <option value="vote_average.desc">Top Rated</option>
          <option value="first_air_date.desc">Latest</option>
        </select>

        <select 
          value={filters.provider}
          onChange={(e) => setFilters({ ...filters, provider: e.target.value })}
        >
          <option value="">All Providers</option>
          <option value="netflix">Netflix</option>
          <option value="sonyliv">SonyLIV</option>
          <option value="zee5">Zee5</option>
          <option value="mxplayer">MX Player</option>
        </select>
      </div>

      {tvShows.length === 0 ? (
        <div className="no-results">
          <h2>No TV shows found</h2>
          <p>Try adjusting your filters</p>
        </div>
      ) : (
        <>
          <div className="tvshow-grid">
            {tvShows.map((tvShow) => (
              <TVShowCard key={tvShow.id} tvShow={tvShow} />
            ))}
          </div>

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
  );
};

export default TVShows;