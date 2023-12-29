import React from 'react';

const Navbar = ({ toc, currentChapter, onChapterSelect }) => {
  return (
    <nav className="navbar">
      <select onChange={onChapterSelect} value={currentChapter}>
        {toc.map((chapter, index) => (
          <option key={index} value={chapter.href}>
            {chapter.label}
          </option>
        ))}
      </select>
      {/* Additional navbar elements can be added here */}
    </nav>
  );
};

export default Navbar;
