import { useState, useEffect } from 'react';
import ePub from 'epubjs';

export const useBookLoader = (bookData, viewerRef) => {
  const [book, setBook] = useState(null);
  const [toc, setToc] = useState([]);
  const [rendition, setRendition] = useState(null);
  const [currentChapter, setCurrentChapter] = useState(null);
  const [currentChapterText, setCurrentChapterText] = useState('');

  useEffect(() => {
    if (bookData) {
      const newBook = ePub(bookData);

      newBook.ready.then(() => {
        setBook(newBook);
        setToc(newBook.navigation.toc);

        if (newBook.navigation.toc.length > 0) {
          const firstChapterHref = newBook.navigation.toc[0].href;
          setCurrentChapter(firstChapterHref);
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

        // Attach the event listener for the rendered event
        newRendition.on('rendered', handleRendered);

        setRendition(newRendition);
      }).catch(error => console.error('Error setting up the book rendition: ', error));

      // Cleanup function to remove event listener and destroy rendition
      return () => {
        if (rendition) {
          rendition.off('rendered', handleRendered); // Remove event listener
          rendition.destroy(); // Destroy rendition
        }
      };
    }
  }, [bookData, viewerRef]); // Include rendition in the dependency array

  const findChapterInToc = (tocItems, href) => {
    for (const item of tocItems) {
      if (item.href === href) {
        return item;
      }
      if (item.subitems) {
        const found = findChapterInToc(item.subitems, href);
        if (found) {
          return found;
        }
      }
    }
    return null;
  };

  const handleRendered = section => {
    setCurrentChapter(section.href);
  };

  const loadChapter = (chapterHref) => {
    console.log('Attempting to load chapter:', chapterHref);

    const chapterItem = findChapterInToc(book.navigation.toc, chapterHref);
    if (chapterItem && book) {
      const chapter = book.spine.get(chapterItem.index);

      chapter.load(book.load.bind(book)).then(doc => {
        const serializer = new XMLSerializer();
        let chapterHtml = serializer.serializeToString(doc);

        //Callback - ensure chapter is set only after content is cleared (React batches state updates which causes issues)
        setCurrentChapterText('', () => {
          setCurrentChapterText(chapterHtml);
        });

        //Updates the current chapter state
        setCurrentChapter(chapterHref);

      }).catch(error => console.error("Error loading chapter content:", error));
    } else {
      console.error("Chapter not found in TOC:", chapterHref);
    }
  };


  return { book, toc, rendition, currentChapter, setCurrentChapter, currentChapterText, setCurrentChapterText, loadChapter };
};


