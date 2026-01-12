// import { useEffect, useState } from "react";
// import { useParams, useNavigate } from "react-router-dom";
// import { useSelector } from "react-redux";
// import { getTVShowDetails } from "../api/api";
// import Navbar from "../components/Navbar";
// import SkeletonLoader from "../components/SkeletonLoader";
// import "./TVShowDetails.css";

// const TVShowDetails = () => {
//   const { id } = useParams();
//   const { token } = useSelector((state) => state.user);
//   const [tvShow, setTVShow] = useState(null);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState(null);
//   const navigate = useNavigate();

//   useEffect(() => {
//   const fetchTVShowDetails = async () => {
//     try {
//       setLoading(true);

//       const { data } = await getTVShowDetails(id, token || null);

//       setTVShow(data);
//       setError(null);
//     } catch (err) {
//       setError(err.response?.data?.message || "Failed to fetch TV show details");
//     } finally {
//       setLoading(false);
//     }
//   };

//   fetchTVShowDetails();
// }, [id]);


//   if (loading) return <SkeletonLoader type="details" />;
//   if (error) return <div className="error">{error}</div>;
//   if (!tvShow) return <div className="error">TV Show not found</div>;

//   return (
//     <div className="tvshow-details-container">
//       <Navbar />

//       <div className="tvshow-details-content">
//         <div className="tvshow-poster-details">
//           <img
//             src={`https://image.tmdb.org/t/p/w500${tvShow.poster_path}`}
//             alt={tvShow.name}
//             onError={(e) => {
//               e.target.src = "https://via.placeholder.com/400x600?text=No+Poster";
//             }}
//           />
//         </div>
//         <div className="tvshow-info-details">
//           <h1>{tvShow.name}</h1>
//           <p><strong>First Air Date:</strong> {tvShow.first_air_date || 'N/A'}</p>
//           <p><strong>Rating:</strong> ⭐ {tvShow.vote_average?.toFixed(1) || 'N/A'}/10</p>
//           <p><strong>Genres:</strong> {tvShow.genres?.map((genre) => genre.name).join(", ") || 'N/A'}</p>
//           <p><strong>Number of Seasons:</strong> {tvShow.number_of_seasons || 'N/A'}</p>
//           <p><strong>Number of Episodes:</strong> {tvShow.number_of_episodes || 'N/A'}</p>
//           <p><strong>Status:</strong> {tvShow.status || 'N/A'}</p>
//           <p><strong>Overview:</strong> {tvShow.overview || 'No overview available'}</p>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default TVShowDetails;






import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { getTVShowDetails, getMovieVideos } from "../api/api";
import Navbar from "../components/Navbar";
import SkeletonLoader from "../components/SkeletonLoader";
import { FaPlay, FaFilm, FaInfoCircle } from 'react-icons/fa';
import "./TVShowDetails.css";

const TVShowDetails = () => {
  const { id } = useParams();
  const { token } = useSelector((state) => state.user);
  const [tvShow, setTVShow] = useState(null);
  const [videos, setVideos] = useState([]);
  const [selectedVideo, setSelectedVideo] = useState(null);
  const [activeTab, setActiveTab] = useState('trailer');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchTVShowDetails = async () => {
      try {
        setLoading(true);

        const { data } = await getTVShowDetails(id, token || null);
        setTVShow(data);
        setError(null);

        // Try to fetch videos, but don't fail if it doesn't work
        try {
          const videosRes = await getMovieVideos(id);
          if (videosRes.data.success && videosRes.data.videos) {
            const videoData = videosRes.data.videos;
            setVideos(videoData);

            // Auto-select first official trailer or teaser
            const officialTrailer = videoData.find(
              v => v.official && (v.type === 'Trailer' || v.type === 'Teaser')
            );
            setSelectedVideo(officialTrailer || videoData[0] || null);
          }
        } catch (videoErr) {
          console.log('Videos not available for this TV show');
          setVideos([]);
        }

      } catch (err) {
        setError(err.response?.data?.message || "Failed to fetch TV show details");
      } finally {
        setLoading(false);
      }
    };

    fetchTVShowDetails();
  }, [id]);

  const getYouTubeEmbedUrl = (url) => {
    const videoId = url?.split('v=')[1] || url?.split('/').pop();
    return `https://www.youtube.com/embed/${videoId}`;
  };

  const groupVideosByType = () => {
    const grouped = {};
    videos.forEach(video => {
      if (!grouped[video.type]) {
        grouped[video.type] = [];
      }
      grouped[video.type].push(video);
    });
    return grouped;
  };

  const filterVideosByTab = () => {
    const grouped = groupVideosByType();
    if (activeTab === 'trailer') {
      return [...(grouped['Trailer'] || []), ...(grouped['Teaser'] || [])];
    } else if (activeTab === 'featurette') {
      return grouped['Featurette'] || [];
    } else if (activeTab === 'behind') {
      return [...(grouped['Behind the Scenes'] || []), ...(grouped['Clip'] || [])];
    }
    return videos;
  };

  if (loading) return <SkeletonLoader type="details" />;
  if (error) return <div className="error">{error}</div>;
  if (!tvShow) return <div className="error">TV Show not found</div>;

  const filteredVideos = filterVideosByTab();

  return (
    <div className="tvshow-details-container">
      <Navbar />

      <div className="tvshow-details-content">
        <div className="tvshow-poster-details">
          <img
            src={`https://image.tmdb.org/t/p/w500${tvShow.poster_path}`}
            alt={tvShow.name}
            onError={(e) => {
              e.target.src = "https://via.placeholder.com/400x600?text=No+Poster";
            }}
          />
        </div>
        <div className="tvshow-info-details">
          <h1>{tvShow.name}</h1>
          <p><strong>First Air Date:</strong> {tvShow.first_air_date || 'N/A'}</p>
          <p><strong>Rating:</strong> ⭐ {tvShow.vote_average?.toFixed(1) || 'N/A'}/10</p>
          <p><strong>Genres:</strong> {tvShow.genres?.map((genre) => genre.name).join(", ") || 'N/A'}</p>
          <p><strong>Number of Seasons:</strong> {tvShow.number_of_seasons || 'N/A'}</p>
          <p><strong>Number of Episodes:</strong> {tvShow.number_of_episodes || 'N/A'}</p>
          <p><strong>Status:</strong> {tvShow.status || 'N/A'}</p>
          <p><strong>Overview:</strong> {tvShow.overview || 'No overview available'}</p>
        </div>
      </div>

      {videos.length > 0 && (
        <div className="video-section">
          <h2 className="video-section-title">
            <FaPlay className="section-icon" /> Videos & Trailers
          </h2>

          {selectedVideo && (
            <div className="main-video-player">
              <iframe
                width="100%"
                height="100%"
                src={getYouTubeEmbedUrl(selectedVideo.url)}
                title={selectedVideo.name}
                frameBorder="0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              ></iframe>
              <div className="video-info">
                <h3>{selectedVideo.name}</h3>
                <span className="video-type-badge">{selectedVideo.type}</span>
              </div>
            </div>
          )}

          <div className="video-tabs">
            <button
              className={`tab-btn ${activeTab === 'trailer' ? 'active' : ''}`}
              onClick={() => setActiveTab('trailer')}
            >
              <FaFilm /> Trailers & Teasers
            </button>
            <button
              className={`tab-btn ${activeTab === 'featurette' ? 'active' : ''}`}
              onClick={() => setActiveTab('featurette')}
            >
              <FaInfoCircle /> Featurettes
            </button>
            <button
              className={`tab-btn ${activeTab === 'behind' ? 'active' : ''}`}
              onClick={() => setActiveTab('behind')}
            >
              <FaPlay /> Behind the Scenes
            </button>
          </div>

          <div className="video-grid">
            {filteredVideos.map((video, index) => (
              <div
                key={index}
                className={`video-card ${selectedVideo?.url === video.url ? 'selected' : ''}`}
                onClick={() => setSelectedVideo(video)}
              >
                <div className="video-thumbnail">
                  <img
                    src={`https://img.youtube.com/vi/${video.url.split('v=')[1] || video.url.split('/').pop()}/hqdefault.jpg`}
                    alt={video.name}
                  />
                  <div className="play-overlay">
                    <FaPlay />
                  </div>
                </div>
                <div className="video-card-info">
                  <h4>{video.name}</h4>
                  <span className="video-type">{video.type}</span>
                </div>
              </div>
            ))}
          </div>

          {filteredVideos.length === 0 && (
            <div className="no-videos">
              <p>No videos available for this category</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default TVShowDetails;