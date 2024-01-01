import React from 'react';
import '../Styles/Navbar.css';

const renderTOCOptions = (tocItems) => {
  return tocItems.map((item, index) => {
    // If the item has a nested structure
    if (item.subitems && item.subitems.length > 0) {
      return (
        <optgroup label={item.label} key={index}>
          {renderTOCOptions(item.subitems)} // Recursively render subitems
        </optgroup>
      );
    } else {
      return (
        <option key={index} value={item.href}>
          {item.label}
        </option>
      );
    }
  });
};

const Navbar = ({ toc, currentChapter, onChapterSelect }) => {
  return (
    <nav className="navbar">
      <select onChange={onChapterSelect} value={currentChapter}>
        {renderTOCOptions(toc)} // Use a function to render options
      </select>
      {/* Additional navbar elements can be added here */}
    </nav>
  );
};


export default Navbar;
