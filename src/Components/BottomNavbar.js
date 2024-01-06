import React from 'react';
import '../Styles/BottomNavbar.css';

const BottomNavbar = ({ onPreviousChapter, onNextChapter }) => {
  return (
    <div className="bottom-navbar">
      <button className="button-left" onClick={onPreviousChapter}>◀</button>
      {/* Other elements */}
      <button className="button-right" onClick={onNextChapter}>▶</button>
    </div>
  );
};

export default BottomNavbar;
