import React, { useEffect, useRef, useState } from 'react';
import { processHtmlToParagraphs, processXmlToParagraphs, processCustomTagToParagraphs } from '../textProcessing';
import ePub from 'epubjs';
import '../Styles/EbookReader.css';
import Navbar from './Navbar';
import BottomNavbar from './BottomNavbar';
import { useBookLoader } from '../Hooks/useBookLoader';


const EpubReader = ({ bookData }) => {
  const viewerRef = useRef();
  const [currentChapter, setCurrentChapter] = useState(null);
  const [readingProgress, setReadingProgress] = useState({ playing: false, percentage: 0 });

  // Custom hook to load and manage the book
  const { book, toc, rendition, loadChapter } = useBookLoader(bookData, viewerRef, currentChapter);

  useEffect(() => {
    // Display the current chapter using the rendition
    if (rendition && currentChapter) {
      rendition.display(currentChapter);
    }
  }, [currentChapter, rendition]);

  const handleChapterSelect = (event) => {
    setCurrentChapter(event.target.value);
  };

  const handleTogglePlay = () => {
    setReadingProgress((prevProgress) => ({
      ...prevProgress,
      playing: !prevProgress.playing,
    }));
    // Additional functionality for audio play/pause and scrolling
  };

  return (
    <div className="epub-reader-container">
      <Navbar toc={toc} currentChapter={currentChapter} onChapterSelect={handleChapterSelect} />
      <div ref={viewerRef} className="epub-viewer"></div>
      <BottomNavbar progress={readingProgress} onTogglePlay={handleTogglePlay} />
    </div>
  );
};
export default EpubReader;


/*
The rendition.display() method in epubjs is used to display a specific section of the book. If no parameter is passed to display(), it defaults to the start of the book, which is often the title page. To display other sections, you need to pass a specific location or CFI (Content Fragment Identifier) to the display() method.

*/

/*
TODO:
- Slowly scroll the text upwards when the play state is active

- Create a TTS system that reads the book back to you
- There should be a progress bar that correlates the position of the book with the progress of the audio in the chapter

*/

/*
Correlation between position of the book and audio progress requires tracking the current position of the text being read and updating a progress bar accordingly:
- Divide the [chapter] text into segments like paragraphs or sentences
- When the TTS system starts reading a new segment, calculate its position relative to the total length of the chapter
- Use the percentage to update the progress bar
- When progress bar is clicked you can jump to different positions in the text and resume TTS from that point


*/