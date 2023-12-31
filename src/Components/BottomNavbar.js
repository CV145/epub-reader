// BottomNavbar.js
import React from 'react';
import '../Styles/BottomNavbar.css';

const BottomNavbar = ({ progress, onTogglePlay }) => {
  const playPauseIcon = progress.playing ? '❚❚' : '▶'; // Simple text icons for play/pause

  return (
    <div className="bottom-navbar">
      <div className="progress-bar-container">
        <div className="progress-bar" style={{ width: `${progress.percentage}%` }}></div>
      </div>
      <button className="play-pause-btn" onClick={onTogglePlay}>
        {playPauseIcon}
      </button>
    </div>
  );
};

export default BottomNavbar;
