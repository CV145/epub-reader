import React from 'react';

const Toolbar = ({ onNext, onPrev }) => (
  <div className="toolbar">
    <button onClick={onPrev}>Previous</button>
    <button onClick={onNext}>Next</button>
    {/* Add more buttons as needed */}
  </div>
);

export default Toolbar;
