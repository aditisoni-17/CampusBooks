import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
} from "react";
import {
  addBook,
  addToWishlist,
  getWishlist,
  getBooks,
  removeBook,
  removeFromWishlist,
  toggleStatus,
  updateBook,
} from "../services";

const AppContext = createContext(null);

export const AppProvider = ({ children }) => {
  const [books, setBooks] = useState([]);
  const [wishlist, setWishlist] = useState([]);
  const [loading, setLoading] = useState(true);

  const loadData = useCallback(async () => {
    setLoading(true);
    try {
      const [bookData, wishlistData] = await Promise.all([
        getBooks(),
        getWishlist(),
      ]);
      setBooks(bookData);
      setWishlist(wishlistData);
      return { books: bookData, wishlist: wishlistData };
    } catch (error) {
      console.error("[AppContext] failed to load persisted data", error);
      throw error;
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadData().catch(() => {});
  }, [loadData]);

  const createListing = async (data) => {
    const newBook = await addBook(data);
    await loadData();
    return newBook;
  };

  const editListing = async (id, updates) => {
    const updated = await updateBook(id, updates);
    await loadData();
    return updated;
  };

  const deleteListing = async (id) => {
    await removeBook(id);
    await loadData();
  };

  const changeStatus = async (id) => {
    const updated = await toggleStatus(id);
    await loadData();
    return updated;
  };

  const addWishlistItem = async (book) => {
    const updated = await addToWishlist(book);
    await loadData();
    return updated;
  };

  const removeWishlistItem = async (id) => {
    const updated = await removeFromWishlist(id);
    await loadData();
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
        removeWishlistItem,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useAppContext = () => useContext(AppContext);
