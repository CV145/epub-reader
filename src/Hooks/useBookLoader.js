import { useState, useEffect } from 'react';
import ePub from 'epubjs';

export const useBookLoader = (bookData, viewerRef) => {
  const [book, setBook] = useState(null);
  const [toc, setToc] = useState([]);
  const [rendition, setRendition] = useState(null);
  const [currentChapter, setCurrentChapter] = useState(null);

  useEffect(() => {
    if (bookData) {
      const newBook = ePub(bookData);

      newBook.ready.then(() => {
        setBook(newBook);
        setToc(newBook.navigation.toc);
        if (newBook.navigation.toc.length > 0) {
          setCurrentChapter(newBook.navigation.toc[0].href); // Set the first chapter
        }
      }).catch(error => {
        console.error('Error loading the book: ', error);
      });

      newBook.loaded.navigation.then(() => {
        const newRendition = newBook.renderTo(viewerRef.current, {
          width: '100%',
          height: '100%',
          flow: 'scrolled-doc',
        });
        setRendition(newRendition);
        if (currentChapter) {
          newRendition.display(currentChapter); // Display the first chapter
        }
      }).catch(error => {
        console.error('Error setting up the book rendition: ', error);
      });

      return () => {
        if (rendition) {
          rendition.destroy();
        }
      };
    }
  }, [bookData, viewerRef, currentChapter]);

  const loadChapter = (chapterHref) => {
    if (book && rendition) {
      rendition.display(chapterHref).catch(error => {
        console.error("Error displaying chapter:", error);
      });
    } else {
      console.error("Book or rendition is not initialized.");
    }
  };

  return { book, toc, rendition, loadChapter };
};
