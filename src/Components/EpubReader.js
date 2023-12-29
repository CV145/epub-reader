import React, { useEffect, useRef, useState } from 'react';
import ePub from 'epubjs';
import '../Styles/EbookReader.css';
import Navbar from './Navbar';

const EpubReader = ({ bookData }) => {
  const viewerRef = useRef();
  const [book, setBook] = useState(null);
  const [rendition, setRendition] = useState(null);
  const [toc, setToc] = useState([]);
  const [currentChapter, setCurrentChapter] = useState(null); // start as null

  useEffect(() => {
    if (bookData && !rendition) {
      console.log("Initializing book and rendition");

      const newBook = ePub(bookData);
      setBook(newBook);

      newBook.ready.then(() => {
        setToc(newBook.navigation.toc);
        const newRendition = newBook.renderTo(viewerRef.current, {
          width: '100%',
          height: '100%',
          flow: 'scrolled-doc',
        });
        setRendition(newRendition);
      }).catch(error => {
        console.error('Error loading the book: ', error);
      });
    }

    return () => {
      if (rendition) {
        console.log("Destroying rendition");
        rendition.destroy();
      }
    };
  }, [bookData]);

  useEffect(() => {
    if (rendition && currentChapter) {
      console.log("Displaying chapter:", currentChapter);
      rendition.display(currentChapter);
    }
  }, [currentChapter, rendition]);

  const handleChapterSelect = (event) => {
    const chapterHref = event.target.value;
    console.log("Chapter selected:", chapterHref);
    setCurrentChapter(chapterHref);
  };

  return (
    <div className="epub-reader-container">
      <Navbar toc={toc} currentChapter={currentChapter} onChapterSelect={handleChapterSelect} />
      <div ref={viewerRef} className="epub-viewer"></div>
    </div>
  );
};


export default EpubReader;


/*
The rendition.display() method in epubjs is used to display a specific section of the book. If no parameter is passed to display(), it defaults to the start of the book, which is often the title page. To display other sections, you need to pass a specific location or CFI (Content Fragment Identifier) to the display() method.

*/

/*
TODO:
- Create the table of contents in the navbar menu on the left side
- Hide/Show the navbar menu using sandwich button
- Create play/pause buttons
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