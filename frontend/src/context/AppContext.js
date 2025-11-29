import React, { createContext, useContext, useEffect, useState, useCallback } from 'react';
import {
  getBooks,
  addBook,
  updateBook,
  removeBook,
  toggleStatus
} from '../services/bookService';
import {
  getWishlist,
  addToWishlist,
  removeFromWishlist
} from '../services/wishlistService';

const AppContext = createContext(null);

export const AppProvider = ({ children }) => {
  const [books, setBooks] = useState([]);
  const [wishlist, setWishlist] = useState([]);
  const [loading, setLoading] = useState(true);

  const loadData = useCallback(async () => {
    setLoading(true);
    const [bookData, wishlistData] = await Promise.all([getBooks(), getWishlist()]);
    setBooks(bookData);
    setWishlist(wishlistData);
    setLoading(false);
  }, []);

  useEffect(() => {
    loadData();
  }, [loadData]);

  const createListing = async data => {
    const newBook = await addBook(data);
    setBooks(prev => [newBook, ...prev]);
    return newBook;
  };

  const editListing = async (id, updates) => {
    const updated = await updateBook(id, updates);
    setBooks(prev => prev.map(item => (item.id === id ? updated : item)));
    return updated;
  };

  const deleteListing = async id => {
    await removeBook(id);
    setBooks(prev => prev.filter(item => item.id !== id));
  };

  const changeStatus = async id => {
    const updated = await toggleStatus(id);
    setBooks(prev => prev.map(item => (item.id === id ? updated : item)));
    return updated;
  };

  const addWishlistItem = async book => {
    const updated = await addToWishlist(book);
    setWishlist(updated);
    return updated;
  };

  const removeWishlistItem = async id => {
    const updated = await removeFromWishlist(id);
    setWishlist(updated);
    return updated;
  };

  return (
    <AppContext.Provider
      value={{
        books,
        wishlist,
        loading,
        reload: loadData,
        createListing,
        editListing,
        deleteListing,
        changeStatus,
        addWishlistItem,
        removeWishlistItem
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useAppContext = () => useContext(AppContext);

