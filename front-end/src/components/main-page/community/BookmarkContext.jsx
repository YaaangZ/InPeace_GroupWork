import React from 'react';

const BookmarkContext = React.createContext({
  bookmarkChange: false,
  setBookmarkChange: () => {},
});

export default BookmarkContext;
