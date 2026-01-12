// import { useEffect, useRef, useState } from "react";
// import { useSelector } from "react-redux";
// import { useNavigate, Link } from "react-router-dom";
// import { getMovies, getTVShows } from "../api/api";
// import MovieCard from "../components/MovieCard";
// import TVShowCard from "../components/TVShowCard";
// import Navbar from "../components/Navbar";
// import Loading from "../components/Loading";
// import ErrorBoundary from "../components/ErrorBoundary";
// import { retryRequest } from "../utils/retryRequest";
// import "./Home.css";

// const Home = () => {
//   const { token } = useSelector((state) => state.user);
//   const navigate = useNavigate();
//   const hasFetched = useRef(false);

//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState(null);
//   const [trendingMovies, setTrendingMovies] = useState([]);
//   const [trendingTVShows, setTrendingTVShows] = useState([]);

//   useEffect(() => {
//     if (hasFetched.current) return;
//     hasFetched.current = true;

//     const fetchHomeData = async () => {
//       try {
//         setLoading(true);
//         setError(null);

//         const moviesRes = await retryRequest(() =>
//           getMovies({ language: "hi", sort: "popularity.desc" })
//         );

//         const tvRes = await retryRequest(() =>
//           getTVShows(token, { language: "hi", sort: "popularity.desc" })
//         );

//         setTrendingMovies(moviesRes.data.data.slice(0, 10));
//         setTrendingTVShows(tvRes.data.data.slice(0, 10));
//       } catch (err) {
//         console.error(err);
//         setError("Something went wrong. Please try again.");
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchHomeData();
//   }, [token, navigate]);

//   if (loading) {
//     return (
//       <div className="home-container">
//         <Navbar />
//         <Loading />
//       </div>
//     );
//   }

//   if (error) {
//     return (
//       <div className="home-container">
//         <Navbar />
//         <div className="error-message">
//           {error}
//           <br />
//           <button onClick={() => window.location.reload()}>Retry</button>
//         </div>
//       </div>
//     );
//   }

//   const featuredMovie = trendingMovies[0];

//   return (
//     <ErrorBoundary>
//       <div className="home-container">
//         <Navbar />

//         <div
//           className="hero-section"
//           style={{
//             backgroundImage: featuredMovie?.backdrop_path
//               ? `linear-gradient(to bottom, rgba(15,12,41,0.4), rgba(15,12,41,0.95)),
//                  url(https://image.tmdb.org/t/p/original${featuredMovie.backdrop_path})`
//               : undefined,
//           }}
//         >
//           <div className="hero-content">
//             <h1 className="hero-title">
//               {featuredMovie?.title || "Welcome to MovieFlix"}
//             </h1>
//             <p className="hero-subtitle">
//               {featuredMovie?.overview?.substring(0, 150) ||
//                 "Discover trending movies and TV shows"}
//             </p>
//           </div>
//         </div>

//         <section className="content-section">
//           <div className="section-header">
//             <h2 className="section-title">🎬 Trending Movies</h2>
//             <Link to="/movies" className="view-all-btn">
//               View All →
//             </Link>
//           </div>

//           <div className="content-grid">
//             {trendingMovies.map((movie) => (
//               <MovieCard key={movie.id} movie={movie} />
//             ))}
//           </div>
//         </section>

//         <section className="content-section">
//           <div className="section-header">
//             <h2 className="section-title">📺 Trending TV Shows</h2>
//             <Link to="/tv-shows" className="view-all-btn">
//               View All →
//             </Link>
//           </div>

//           <div className="content-grid">
//             {trendingTVShows.map((tv) => (
//               <TVShowCard key={tv.id} tvShow={tv} />
//             ))}
//           </div>
//         </section>
//       </div>
//     </ErrorBoundary>
//   );
// };

// export default Home;













import { useEffect, useRef, useState } from "react";
import { useSelector } from "react-redux";
import { useNavigate, Link } from "react-router-dom";
import { getMovies, getTVShows } from "../api/api";
import MovieCard from "../components/MovieCard";
import TVShowCard from "../components/TVShowCard";
import Navbar from "../components/Navbar";
import Loading from "../components/Loading";
import ErrorBoundary from "../components/ErrorBoundary";
import { retryRequest } from "../utils/retryRequest";
import { FaPlay, FaInfoCircle, FaChevronLeft, FaChevronRight } from "react-icons/fa";
import "./Home.css";

const Home = () => {
  const { token } = useSelector((state) => state.user);
  const navigate = useNavigate();
  const hasFetched = useRef(false);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [trendingMovies, setTrendingMovies] = useState([]);
  const [trendingTVShows, setTrendingTVShows] = useState([]);
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);

  useEffect(() => {
    if (hasFetched.current) return;
    hasFetched.current = true;

    const fetchHomeData = async () => {
      try {
        setLoading(true);
        setError(null);

        const moviesRes = await retryRequest(() =>
          getMovies({ language: "hi", sort: "popularity.desc" })
        );

        const tvRes = await retryRequest(() =>
          getTVShows(token, { language: "hi", sort: "popularity.desc" })
        );

        setTrendingMovies(moviesRes.data.data.slice(0, 10));
        setTrendingTVShows(tvRes.data.data.slice(0, 10));
      } catch (err) {
        console.error(err);
        setError("Something went wrong. Please try again.");
      } finally {
        setLoading(false);
      }
    };

    fetchHomeData();
  }, [token, navigate]);

  useEffect(() => {
    if (!isAutoPlaying || trendingMovies.length === 0) return;

    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % Math.min(5, trendingMovies.length));
    }, 5000);

    return () => clearInterval(interval);
  }, [isAutoPlaying, trendingMovies.length]);

  const handlePrevSlide = () => {
    setIsAutoPlaying(false);
    setCurrentSlide((prev) => 
      prev === 0 ? Math.min(5, trendingMovies.length) - 1 : prev - 1
    );
  };

  const handleNextSlide = () => {
    setIsAutoPlaying(false);
    setCurrentSlide((prev) => (prev + 1) % Math.min(5, trendingMovies.length));
  };

  const handleDotClick = (index) => {
    setIsAutoPlaying(false);
    setCurrentSlide(index);
  };

  if (loading) {
    return (
      <div className="home-container">
        <Navbar />
        <Loading />
      </div>
    );
  }

  if (error) {
    return (
      <div className="home-container">
        <Navbar />
        <div className="error-message">
          {error}
          <br />
          <button onClick={() => window.location.reload()}>Retry</button>
        </div>
      </div>
    );
  }

  const heroMovies = trendingMovies.slice(0, 5);
  const currentMovie = heroMovies[currentSlide];

  return (
    <ErrorBoundary>
      <div className="home-container">
        <Navbar />

        <div className="hero-slider">
          {heroMovies.map((movie, index) => (
            <div
              key={movie.id}
              className={`hero-slide ${index === currentSlide ? 'active' : ''} ${
                index === currentSlide - 1 || (currentSlide === 0 && index === heroMovies.length - 1)
                  ? 'prev'
                  : ''
              } ${index === currentSlide + 1 || (currentSlide === heroMovies.length - 1 && index === 0) ? 'next' : ''}`}
              style={{
                backgroundImage: movie.backdrop_path
                  ? `linear-gradient(to right, rgba(15,12,41,0.95) 0%, rgba(15,12,41,0.7) 50%, rgba(15,12,41,0.3) 100%),
                     url(https://image.tmdb.org/t/p/original${movie.backdrop_path})`
                  : undefined,
              }}
            >
              <div className="hero-content">
                <div className="hero-badge">🔥 Trending Now</div>
                <h1 className="hero-title">{movie.title}</h1>
                
                <div className="hero-meta">
                  <span className="hero-rating">⭐ {movie.vote_average?.toFixed(1)}</span>
                  <span className="hero-year">{movie.release_date?.split('-')[0]}</span>
                  <span className="hero-language">{movie.original_language?.toUpperCase()}</span>
                </div>

                <p className="hero-subtitle">
                  {movie.overview?.substring(0, 200)}...
                </p>

                <div className="hero-actions">
                  {/* <Link to={`/movie/${movie.id}`} className="hero-btn primary">
                    <FaPlay /> Watch Trailer
                  </Link> */}
                  <Link to={`/movie/${movie.id}`} className="hero-btn secondary">
                    <FaInfoCircle /> More Info
                  </Link>
                </div>
              </div>

              <div className="hero-poster-mobile">
                <img 
                  src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`}
                  alt={movie.title}
                />
              </div>
            </div>
          ))}

          <button className="slider-btn prev" onClick={handlePrevSlide}>
            <FaChevronLeft />
          </button>
          <button className="slider-btn next" onClick={handleNextSlide}>
            <FaChevronRight />
          </button>

          <div className="slider-dots">
            {heroMovies.map((_, index) => (
              <button
                key={index}
                className={`dot ${index === currentSlide ? 'active' : ''}`}
                onClick={() => handleDotClick(index)}
              />
            ))}
          </div>
        </div>

        <section className="content-section">
          <div className="section-header">
            <h2 className="section-title">🎬 Trending Movies</h2>
            <Link to="/movies" className="view-all-btn">
              View All →
            </Link>
          </div>

          <div className="content-grid">
            {trendingMovies.map((movie) => (
              <MovieCard key={movie.id} movie={movie} />
            ))}
          </div>
        </section>

        <section className="content-section">
          <div className="section-header">
            <h2 className="section-title">📺 Trending TV Shows</h2>
            <Link to="/tv-shows" className="view-all-btn">
              View All →
            </Link>
          </div>

          <div className="content-grid">
            {trendingTVShows.map((tv) => (
              <TVShowCard key={tv.id} tvShow={tv} />
            ))}
          </div>
        </section>
      </div>
    </ErrorBoundary>
  );
};

export default Home;