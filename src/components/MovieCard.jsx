import { useState } from "react";
import { motion } from "framer-motion";
import { FaHeart, FaBookmark, FaShareAlt } from "react-icons/fa";
import { useDispatch, useSelector } from "react-redux";
import { saveMovie, toggleLike } from "../api/api";
import {
  toggleLike as toggleLikeAction,
  toggleSave as toggleSaveAction,
} from "../store/slices/movieSlice";
import { Link } from "react-router-dom";
import SkeletonLoader from "./SkeletonLoader";
import { openAuthModal } from "../store/slices/uiSlice";
import "./MovieCard.css";

const MovieCard = ({ movie, isLoading = false }) => {
  const dispatch = useDispatch();
  const { token } = useSelector((state) => state.user);
  const { likedMovies = [], savedMovies = [] } = useSelector(
    (state) => state.movie
  );

  const [showSharePopup, setShowSharePopup] = useState(false);

  if (isLoading) return <SkeletonLoader type="card" />;
  if (!movie) return null;

  const isLiked = likedMovies.includes(movie.id);
  const isSaved = savedMovies.includes(movie.id);

  const handleLike = async (e) => {
    e.preventDefault();
    e.stopPropagation();

    if (!token) {
      dispatch(openAuthModal());
      return;
    }

    try {
      await toggleLike({ movieId: movie.id }, token);
      dispatch(toggleLikeAction(movie.id));
    } catch {
      console.error("Like failed");
    }
  };

  const handleSave = async (e) => {
    e.preventDefault();
    e.stopPropagation();

    if (!token) {
      dispatch(openAuthModal());
      return;
    }

    try {
      await saveMovie({ movieId: movie.id }, token);
      dispatch(toggleSaveAction(movie.id));
    } catch {
      console.error("Save failed");
    }
  };

  const handleShare = (e) => {
    e.preventDefault();
    e.stopPropagation();

    const url = `${window.location.origin}/movie/${movie.id}`;

    if (navigator.share) {
      navigator.share({
        title: movie.title,
        text: `Check out ${movie.title}!`,
        url,
      });
    } else {
      navigator.clipboard.writeText(url);
      setShowSharePopup(true);

      setTimeout(() => {
        setShowSharePopup(false);
      }, 2000);
    }
  };

  return (
    <Link
      to={`/movie/${movie.id}`}
      style={{ textDecoration: "none", color: "inherit" }}
    >
      <motion.div whileHover={{ scale: 1.05 }} className="movie-card">
        <div className="movie-poster">
          <img
            src={
              movie.poster_path
                ? `https://image.tmdb.org/t/p/w500${movie.poster_path}`
                : "https://via.placeholder.com/200x300?text=No+Poster"
            }
            alt={movie.title}
          />
          <div className="movie-rating">
            ⭐ {movie.vote_average?.toFixed(1) || "N/A"}
          </div>
        </div>

        <div className="movie-info">
          <h3 className="movie-title">{movie.title}</h3>
          <p className="movie-overview">
            {movie.overview?.substring(0, 100) || "No description available"}...
          </p>

          <div className="movie-actions">
            <FaHeart
              className={`action-icon ${isLiked ? "liked" : ""}`}
              onClick={handleLike}
            />
            <FaBookmark
              className={`action-icon ${isSaved ? "saved" : ""}`}
              onClick={handleSave}
            />
            <FaShareAlt
              title="Share"
              className="action-icon"
              onClick={handleShare}
            />
          </div>
        </div>

        {showSharePopup && (
          <div className="share-popup">🔗 Link copied!</div>
        )}
      </motion.div>
    </Link>
  );
};

export default MovieCard;
