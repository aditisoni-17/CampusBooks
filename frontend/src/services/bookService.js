import storageService from './storageService';
import mockBooks from '../data/mockBooks';

const BOOKS_KEY = 'BOOKS';

const seedBooks = async () => {
  const existing = await storageService.getItem(BOOKS_KEY);
  if (existing && existing.length) {
    return existing;
  }
  await storageService.setItem(BOOKS_KEY, mockBooks);
  return mockBooks;
};

export const getBooks = async () => {
  const books = await storageService.getItem(BOOKS_KEY);
  if (books && books.length) {
    return books;
  }
  return seedBooks();
};

const saveBooks = books => storageService.setItem(BOOKS_KEY, books);

export const addBook = async book => {
  const books = await getBooks();
  const newBook = {
    id: Date.now().toString(),
    status: 'Available',
    ...book
  };
  const updated = [newBook, ...books];
  await saveBooks(updated);
  return newBook;
};

export const updateBook = async (id, updates) => {
  const books = await getBooks();
  const updated = books.map(item => (item.id === id ? { ...item, ...updates } : item));
  await saveBooks(updated);
  return updated.find(item => item.id === id);
};

export const removeBook = async id => {
  const books = await getBooks();
  const updated = books.filter(item => item.id !== id);
  await saveBooks(updated);
  return updated;
};

export const toggleStatus = async id => {
  const books = await getBooks();
  const updated = books.map(item =>
    item.id === id
      ? { ...item, status: item.status === 'Available' ? 'Taken' : 'Available' }
      : item
  );
  await saveBooks(updated);
  return updated.find(item => item.id === id);
};

export const getBooksByOwner = async contact => {
  const books = await getBooks();
  return books.filter(item => item.contact === contact);
};

export const getSimilarBooks = async book => {
  const books = await getBooks();
  return books.filter(
    item =>
      item.id !== book.id &&
      (item.category === book.category || item.author === book.author)
  );
};

export const clearBooks = () => storageService.removeItem(BOOKS_KEY);

