import mockBooks from "../data/mockBooks";
import storageService from "./storageService";

const BOOKS_KEY = "BOOKS";

const normalizeStatus = (status) => (status === "Taken" ? "Sold" : status);

const normalizeBook = (book) => ({
  ...book,
  status: normalizeStatus(book.status || "Available"),
  location: book.location || "Campus meetup spot",
  imageUri: book.imageUri || null,
});

const normalizeBooks = (books) => books.map(normalizeBook);

const readBooks = async () => {
  const books = await storageService.getArray(BOOKS_KEY);
  return normalizeBooks(books);
};

const writeBooks = (books) =>
  storageService.setParsedItem(BOOKS_KEY, normalizeBooks(books));

const seedBooks = async () => {
  const existing = await readBooks();
  if (existing && existing.length) {
    return existing;
  }

  const seededBooks = normalizeBooks(mockBooks);
  await writeBooks(seededBooks);
  return seededBooks;
};

export const listBooks = async () => {
  const books = await readBooks();
  if (books && books.length) {
    return books;
  }

  return seedBooks();
};

export const createBook = async (book) => {
  const books = await listBooks();
  const newBook = normalizeBook({
    id: Date.now().toString(),
    status: "Available",
    ...book,
  });
  const updated = [newBook, ...books];
  await writeBooks(updated);
  return newBook;
};

export const updateBook = async (id, updates) => {
  const books = await listBooks();
  const updated = books.map((item) =>
    item.id === id ? normalizeBook({ ...item, ...updates }) : item
  );

  await writeBooks(updated);
  return updated.find((item) => item.id === id);
};

export const deleteBook = async (id) => {
  const books = await listBooks();
  const updated = books.filter((item) => item.id !== id);
  await writeBooks(updated);
  return updated;
};

export const toggleBookStatus = async (id) => {
  const books = await listBooks();
  const updated = books.map((item) =>
    item.id === id
      ? normalizeBook({
          ...item,
          status: item.status === "Available" ? "Sold" : "Available",
        })
      : item
  );

  await writeBooks(updated);
  return updated.find((item) => item.id === id);
};

export const listBooksByOwner = async (contact) => {
  const books = await listBooks();
  return books.filter((item) => item.contact === contact);
};

export const getSimilarBooks = async (book) => {
  const books = await listBooks();
  const similarBooks = books.filter(
    (item) =>
      item.id !== book.id &&
      (item.category === book.category || item.author === book.author)
  );
  return similarBooks;
};

export const clearBooks = () => storageService.removeItem(BOOKS_KEY);

export const getBooks = listBooks;
export const addBook = createBook;
export const removeBook = deleteBook;
export const toggleStatus = toggleBookStatus;
export const getBooksByOwner = listBooksByOwner;
