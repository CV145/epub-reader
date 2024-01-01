import React, { useEffect, useRef, useState } from 'react';
import ePub from 'epubjs';
import '../Styles/EbookReader.css';
import Navbar from './Navbar';
import BottomNavbar from './BottomNavbar';
import { useBookLoader } from '../Hooks/useBookLoader';

const EpubReader = ({ bookData }) => {
  const viewerRef = useRef();
  const [readingProgress, setReadingProgress] = useState({ playing: false, percentage: 0 });
  const [ttsUtterance, setTtsUtterance] = useState(null);

  const {
    book,
    toc,
    rendition,
    currentChapter,
    setCurrentChapter,
    currentChapterText,
    setCurrentChapterText,
    loadChapter,
  } = useBookLoader(bookData, viewerRef);
  

  const testTTS = () => {
    const utterance = new SpeechSynthesisUtterance('Hello world');
    speechSynthesis.speak(utterance);
  };
  

  const startTTS = () => {
    console.log("starting tts");
    if (!currentChapterText || readingProgress.playing) return;

    const utterance = new SpeechSynthesisUtterance(currentChapterText);

    console.log("Current chapter text: " + currentChapterText);

    utterance.onend = () => {
      setReadingProgress(prev => ({ ...prev, playing: false }));
    };
    speechSynthesis.speak(utterance);

    setTtsUtterance(utterance);
    setReadingProgress(prev => ({ ...prev, playing: true }));
  };

  const stopTTS = () => {
    if (ttsUtterance) {
      speechSynthesis.cancel();
    }
    setReadingProgress(prev => ({ ...prev, playing: false }));
  };

  const handleTogglePlay = () => {
    testTTS();
    setReadingProgress(prevProgress => {
      if (prevProgress.playing) {
        stopTTS();
      } else {
        startTTS();
      }
      return {
        ...prevProgress,
        playing: !prevProgress.playing,
      };
    });
  };

  const handleChapterLoaded = (text) => {
    setCurrentChapterText(text);
  };

  
  useEffect(() => {
    if (rendition && currentChapter) {
      loadChapter(currentChapter, (chapterText) => {
        setCurrentChapterText(chapterText); // Update the chapter text state
      });
      rendition.display(currentChapter);
    }
  }, [currentChapter, rendition, loadChapter]);
  

  const handleChapterSelect = (event) => {
    setCurrentChapter(event.target.value);
  };
  
  

  return (
    <div className="epub-reader-container">
      <Navbar toc={toc} currentChapter={currentChapter} onChapterSelect={handleChapterSelect} />
      
      {/* Container to display the chapter text */}
      <div className="chapter-text-container" dangerouslySetInnerHTML={{ __html: currentChapterText }}></div>
      
      {/* Viewer ref might be used for other purposes, like displaying the chapter as a styled page */}
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