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
        // Consider setting the first chapter here if needed
      }).catch(error => console.error('Error loading the book: ', error));

      newBook.loaded.navigation.then(() => {
        const newRendition = newBook.renderTo(viewerRef.current, {
          width: '100%',
          height: '100%',
          flow: 'scrolled-doc',
        });
        setRendition(newRendition);
      }).catch(error => console.error('Error setting up the book rendition: ', error));

      return () => {
        if (rendition) {
          rendition.destroy();
        }
      };
    }
  }, [bookData, viewerRef]);

  const loadChapter = (chapterHref) => {
    const chapterIndex = book.navigation.toc.findIndex(item => item.href === chapterHref);
    if (chapterIndex !== -1 && book) {
      const chapter = book.spine.get(chapterIndex);
      chapter.load(book.load.bind(book)).then(doc => {
        const serializer = new XMLSerializer();
        const chapterHtml = serializer.serializeToString(doc);
        setCurrentChapterText(chapterHtml);
      }).catch(error => console.error("Error loading chapter content:", error));
    } else {
      console.error("Chapter not found in TOC.");
    }
  };

  return { book, toc, rendition, currentChapter, setCurrentChapter, currentChapterText, setCurrentChapterText, loadChapter };
};
