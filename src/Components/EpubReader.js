import React, { useEffect, useRef, useState } from 'react';
import ePub from 'epubjs';

const EpubReader = ({ bookData }) => {
  // useRef to store a reference to the viewer DOM element where the ePub will be rendered.
  const viewerRef = useRef(null);

  // useState to manage the rendition (rendered book) state.
  const [rendition, setRendition] = useState(null);

  // useRef to store a reference to the scroll interval for auto-scrolling functionality.
  const scrollIntervalRef = useRef(null);

  // Function to start auto-scrolling the content in the viewer.
  const startAutoScroll = () => {
    const scrollStep = 1; // Number of pixels to scroll in each interval.
    const intervalMs = 100; // Time in milliseconds between each scroll step.

    // Setting up an interval to scroll the viewer content.
    scrollIntervalRef.current = setInterval(() => {
      if (viewerRef.current) {
        viewerRef.current.scrollBy(0, scrollStep); // Scroll the viewer.
      }
    }, intervalMs);
  };

  // Function to stop the auto-scrolling.
  const stopAutoScroll = () => {
    clearInterval(scrollIntervalRef.current); // Clear the interval set for scrolling.
  };

  // useEffect to handle the book rendering when the component mounts or when bookData changes.
  useEffect(() => {
    if (bookData) {
      const book = ePub(bookData); // Initialize the ePub book with the provided data.
      const newRendition = book.renderTo(viewerRef.current, { // Render the book in the viewer.
        width: '100%',
        height: '100%',
        spread: 'none', // Configuration for the rendition.
      });

      setRendition(newRendition); // Update the rendition state.

      newRendition.display(); // Display the book.

      // Start auto-scrolling after the book is rendered.
      startAutoScroll();

      // Cleanup function to run when the component unmounts.
      return () => {
        if (rendition) {
          rendition.destroy(); // Destroy the rendition.
        }
        stopAutoScroll(); // Stop the auto-scrolling.
      };
    }
  }, [bookData]); // Effect dependency on bookData.

  // Render method for the component.
  return (
    <div ref={viewerRef} style={{ width: '100%', height: '100vh', overflow: 'auto' }}>
      {/* The book content will be rendered inside this div */}
    </div>
  );
};

export default EpubReader;



/*
display method: shows a specific location in the book
*/