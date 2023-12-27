import React, { useState } from 'react';
import EpubLoader from './Components/EpubLoader';
import EpubReader from './Components/EpubReader';

const App = () => {
  const [bookData, setBookData] = useState(null);

  const handleBookLoad = (data) => {
    setBookData(data);
  };

  return (
    <div>
      {!bookData ? (
        <EpubLoader onBookLoad={handleBookLoad} />
      ) : (
        <EpubReader bookData={bookData} />
      )}
    </div>
  );
};

export default App;

/*
Ok we got ebook loading in
Now the bookData needs to be rendered in the reader
And scrolled upwards using TTS
*/