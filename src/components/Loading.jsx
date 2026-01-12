import './Loading.css';

const Loading = () => {
  return (
    <div className="loading-container">
      <div className="loading-content">
        <div className="spinner-container">
          <div className="spinner"></div>
          <div className="logo">🎬</div>
        </div>
        <p className="loading-text">Loading your entertainment...</p>
      </div>
    </div>
  );
};

export default Loading;
