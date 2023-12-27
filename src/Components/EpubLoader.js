import React, { useCallback } from 'react';

const EpubLoader = ({ onBookLoad }) => {
  const handleFileSelect = useCallback((event) => {
    const file = event.target.files[0];
    if (file) {
      // Create a FileReader to read the ePub file
      const reader = new FileReader();

      reader.onload = (e) => {
        const bookData = e.target.result;
        // Call the onBookLoad prop with the loaded book data
        onBookLoad(bookData);
      };

      // Read the file as an ArrayBuffer which epub.js can use
      reader.readAsArrayBuffer(file);
    }
  }, [onBookLoad]);

  return (
    <div>
      <input type="file" accept=".epub" onChange={handleFileSelect} />
      <p>Upload an ePub file to get started.</p>
    </div>
  );
};

export default EpubLoader;
