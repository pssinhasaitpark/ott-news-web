import React from 'react';
import './SkeletonLoader.css';

const SkeletonLoader = ({ type = 'card' }) => {
  if (type === 'card') {
    return (
      <div className="skeleton-card">
        <div className="skeleton-poster"></div>
        <div className="skeleton-title"></div>
        <div className="skeleton-overview"></div>
        <div className="skeleton-actions"></div>
      </div>
    );
  }

  if (type === 'details') {
    return (
      <div className="skeleton-details">
        <div className="skeleton-poster-details"></div>
        <div className="skeleton-info">
          <div className="skeleton-title-large"></div>
          <div className="skeleton-text"></div>
          <div className="skeleton-text"></div>
          <div className="skeleton-text"></div>
          <div className="skeleton-text"></div>
          <div className="skeleton-actions-details"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="skeleton-text" style={{ width: '100%', height: '20px', margin: '10px 0' }}></div>
  );
};

export default SkeletonLoader;
