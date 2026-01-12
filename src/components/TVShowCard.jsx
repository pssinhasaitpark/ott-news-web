import { useState } from "react";
import { motion } from "framer-motion";
import { FaHeart, FaBookmark, FaShareAlt } from "react-icons/fa";
import { useDispatch, useSelector } from "react-redux";
import { saveTVShow, toggleLikeTVShow } from "../api/api";
import { Link } from "react-router-dom";
import "./TVShowCard.css";
import { openAuthModal } from "../store/slices/uiSlice";

const TVShowCard = ({ tvShow }) => {
  const dispatch = useDispatch();
  const { token } = useSelector((state) => state.user);
  const { likedTVShows = [], savedTVShows = [] } = useSelector(
    (state) => state.tv
  );

  const [showSharePopup, setShowSharePopup] = useState(false);

  if (!tvShow) return null;

  const isLiked = likedTVShows.includes(tvShow.id);
  const isSaved = savedTVShows.includes(tvShow.id);

  const handleLike = async (e) => {
    e.preventDefault();
    e.stopPropagation();

    if (!token) {
      dispatch(openAuthModal());
      return;
    }

    try {
      await toggleLikeTVShow({ tvId: tvShow.id }, token);
      dispatch({ type: "tv/toggleLike", payload: tvShow.id });
    } catch {
      console.error("TV like failed");
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
      await saveTVShow({ tvId: tvShow.id }, token);
      dispatch({ type: "tv/toggleSave", payload: tvShow.id });
    } catch {
      console.error("TV save failed");
    }
  };

  const handleShare = (e) => {
    e.preventDefault();
    e.stopPropagation();

    const url = `${window.location.origin}/tv-show/${tvShow.id}`;

    if (navigator.share) {
      navigator.share({
        title: tvShow.name,
        text: `Check out ${tvShow.name}!`,
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
      to={`/tv-show/${tvShow.id}`}
      style={{ textDecoration: "none", color: "inherit" }}
    >
      <motion.div whileHover={{ scale: 1.05 }} className="tvshow-card">
        <div className="tvshow-poster">
          <img
            src={
              tvShow.poster_path
                ? `https://image.tmdb.org/t/p/w500${tvShow.poster_path}`
                : "https://via.placeholder.com/200x300?text=No+Poster"
            }
            alt={tvShow.name}
          />
          <div className="tvshow-rating">
            ⭐ {tvShow.vote_average?.toFixed(1) || "N/A"}
          </div>
        </div>

        <div className="tvshow-info">
          <h3 className="tvshow-title">{tvShow.name}</h3>
          <p className="tvshow-overview">
            {tvShow.overview?.substring(0, 100) || "No description available"}
            ...
          </p>

          <div className="tvshow-actions">
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

        {showSharePopup && <div className="share-popup">🔗 Link copied!</div>}
      </motion.div>
    </Link>
  );
};

export default TVShowCard;
