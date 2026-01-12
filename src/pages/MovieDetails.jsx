// import { useEffect, useState } from 'react';
// import { useParams, useNavigate } from 'react-router-dom';
// import { useSelector } from 'react-redux';
// import { getMovieDetails } from '../api/api';
// import Navbar from '../components/Navbar';
// import SkeletonLoader from '../components/SkeletonLoader';
// import './MovieDetails.css';

// const MovieDetails = () => {
//   const { id } = useParams();
//   const { token } = useSelector((state) => state.user);
//   const [movie, setMovie] = useState(null);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState(null);
//   const navigate = useNavigate();

//   useEffect(() => {
//   const fetchMovieDetails = async () => {
//     try {
//       setLoading(true);

//       const { data } = await getMovieDetails(id, token || null);

//       setMovie(data);
//       setError(null);
//     } catch (err) {
//       setError(err.response?.data?.message || 'Failed to fetch movie details');
//     } finally {
//       setLoading(false);
//     }
//   };

//   fetchMovieDetails();
// }, [id]);


//   if (loading) return <SkeletonLoader type="details" />;
//   if (error) return <div className="error">{error}</div>;
//   if (!movie) return <div className="error">Movie not found</div>;

//   return (
//     <div className="movie-details-container">
//       <Navbar />

//       <div className="movie-details-content">
//         <div className="movie-poster-details">
//           <img
//             src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`}
//             alt={movie.title}
//             onError={(e) => {
//               e.target.src = 'https://via.placeholder.com/400x600?text=No+Poster';
//             }}
//           />
//         </div>
//         <div className="movie-info-details">
//           <h1>{movie.title}</h1>
//           <p><strong>Release Date:</strong> {movie.release_date || 'N/A'}</p>
//           <p><strong>Rating:</strong> ⭐ {movie.vote_average?.toFixed(1) || 'N/A'}/10</p>
//           <p><strong>Genres:</strong> {movie.genres?.map(genre => genre.name).join(', ') || 'N/A'}</p>
//           <p><strong>Runtime:</strong> {movie.runtime ? `${movie.runtime} minutes` : 'N/A'}</p>
//           <p><strong>Overview:</strong> {movie.overview || 'No overview available'}</p>
          
//           {movie.budget > 0 && (
//             <p><strong>Budget:</strong> ${movie.budget.toLocaleString()}</p>
//           )}
          
//           {movie.revenue > 0 && (
//             <p><strong>Revenue:</strong> ${movie.revenue.toLocaleString()}</p>
//           )}
//         </div>
//       </div>
//     </div>
//   );
// };

// export default MovieDetails;







import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { getMovieDetails, getMovieVideos } from '../api/api';
import Navbar from '../components/Navbar';
import SkeletonLoader from '../components/SkeletonLoader';
import { FaPlay, FaFilm, FaInfoCircle } from 'react-icons/fa';
import './MovieDetails.css';

const MovieDetails = () => {
  const { id } = useParams();
  const { token } = useSelector((state) => state.user);
  const [movie, setMovie] = useState(null);
  const [videos, setVideos] = useState([]);
  const [selectedVideo, setSelectedVideo] = useState(null);
  const [activeTab, setActiveTab] = useState('trailer');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchMovieDetails = async () => {
      try {
        setLoading(true);

        const { data } = await getMovieDetails(id, token || null);
        setMovie(data);

        const videosRes = await getMovieVideos(id);
        const videoData = videosRes.data.videos || [];
        setVideos(videoData);

        // Auto-select first official trailer or teaser
        const officialTrailer = videoData.find(
          v => v.official && (v.type === 'Trailer' || v.type === 'Teaser')
        );
        setSelectedVideo(officialTrailer || videoData[0] || null);

        setError(null);
      } catch (err) {
        setError(err.response?.data?.message || 'Failed to fetch movie details');
      } finally {
        setLoading(false);
      }
    };

    fetchMovieDetails();
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
  if (!movie) return <div className="error">Movie not found</div>;

  const filteredVideos = filterVideosByTab();

  return (
    <div className="movie-details-container">
      <Navbar />

      <div className="movie-details-content">
        <div className="movie-poster-details">
          <img
            src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`}
            alt={movie.title}
            onError={(e) => {
              e.target.src = 'https://via.placeholder.com/400x600?text=No+Poster';
            }}
          />
        </div>

        <div className="movie-info-details">
          <h1>{movie.title}</h1>
          <p><strong>Release Date:</strong> {movie.release_date || 'N/A'}</p>
          <p><strong>Rating:</strong> ⭐ {movie.vote_average?.toFixed(1) || 'N/A'}/10</p>
          <p><strong>Genres:</strong> {movie.genres?.map(genre => genre.name).join(', ') || 'N/A'}</p>
          <p><strong>Runtime:</strong> {movie.runtime ? `${movie.runtime} minutes` : 'N/A'}</p>
          <p><strong>Overview:</strong> {movie.overview || 'No overview available'}</p>
          
          {movie.budget > 0 && (
            <p><strong>Budget:</strong> ${movie.budget.toLocaleString()}</p>
          )}
          
          {movie.revenue > 0 && (
            <p><strong>Revenue:</strong> ${movie.revenue.toLocaleString()}</p>
          )}
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

export default MovieDetails;