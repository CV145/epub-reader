import React, { useEffect, useRef } from 'react';
import ePub from 'epubjs';
import '../Styles/EbookReader.css';
import Navbar from './Navbar';
import BottomNavbar from './BottomNavbar';
import { useBookLoader } from '../Hooks/useBookLoader';

const EpubReader = ({ bookData }) => {
  const viewerRef = useRef();

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

  useEffect(() => {
    if (book && rendition && currentChapter) {
      console.log('useEffect triggered for currentChapter:', currentChapter);

      book.loaded.navigation.then(() => {
        rendition.display(currentChapter).then(() => {
          console.log('Chapter displayed:', currentChapter);
        }).catch(error => console.error("Error displaying chapter:", error));
      }).catch(error => console.error("Error loading book navigation:", error));
    }
  }, [book, rendition, currentChapter]);

  const handleChapterSelect = (event) => {
    setCurrentChapter(event.target.value);
  };

  const findChapterIndex = (toc, href) => {
    for (let i = 0; i < toc.length; i++) {
      if (toc[i].href === href) {
        return i;
      }
      if (toc[i].subitems && toc[i].subitems.length) {
        const subIndex = findChapterIndex(toc[i].subitems, href);
        if (subIndex !== -1) {
          return i; // Return the index of the parent item
        }
      }
    }
    return -1; // Not found
  };

  const findNextChapter = (toc, href) => {
    let found = false;
    const findNext = (items) => {
      for (let item of items) {
        if (found === true) {
          return item.href; // Return the next chapter after the current one
        }
        if (item.href === href) {
          found = true; // Set found to true when the current chapter is matched
        }
        if (item.subitems && item.subitems.length) {
          const subChapter = findNext(item.subitems);
          if (subChapter) {
            return subChapter; // Return the next chapter in subitems
          }
        }
      }
      return null; // If there is no next chapter
    };

    return findNext(toc);
  };

  const findPreviousChapter = (toc, href) => {
    let previous = null;
    const findPrevious = (items) => {
      for (let item of items) {
        if (item.href === href) {
          return previous; // Return the previous chapter before the current one
        }
        if (item.subitems && item.subitems.length) {
          const subChapter = findPrevious(item.subitems);
          if (subChapter) {
            return subChapter; // Return the previous chapter in subitems
          }
        }
        previous = item.href; // Keep track of the previous item as we go
      }
      return null; // If there is no previous chapter
    };

    return findPrevious(toc);
  };

  const goToPreviousChapter = () => {
    const previousChapterHref = findPreviousChapter(toc, currentChapter);
    if (previousChapterHref) {
      setCurrentChapter(previousChapterHref);
      loadChapter(previousChapterHref);
    } else {
      console.log("This is the first chapter.");
    }
  };

  const goToNextChapter = () => {
    console.log('Going to next chapter from:', currentChapter);
    const nextChapterHref = findNextChapter(toc, currentChapter);
    if (nextChapterHref) {
      setCurrentChapter(nextChapterHref);
      loadChapter(nextChapterHref);
    } else {
      console.log("This is the last chapter.");
    }
  };


  return (
    <div>
      <div className="epub-reader-container">
        <Navbar toc={toc} currentChapter={currentChapter} onChapterSelect={handleChapterSelect} />

        <div
          key={currentChapter}
          className="chapter-text-container"
          dangerouslySetInnerHTML={{ __html: currentChapterText }}>
        </div>

        <div ref={viewerRef} className="epub-viewer"></div>

        <BottomNavbar onPreviousChapter={goToPreviousChapter} onNextChapter={goToNextChapter} />
      </div>
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