import storageService from "./storageService";

const WISHLIST_KEY = "WISHLIST";

const dedupeWishlist = (wishlist) => {
  const seenIds = new Set();

  return wishlist.filter((item) => {
    if (!item?.id || seenIds.has(item.id)) {
      return false;
    }

    seenIds.add(item.id);
    return true;
  });
};

const readWishlist = async () => {
  const wishlist = await storageService.getArray(WISHLIST_KEY);
  const dedupedWishlist = dedupeWishlist(wishlist);

  if (dedupedWishlist.length !== wishlist.length) {
    await storageService.setParsedItem(WISHLIST_KEY, dedupedWishlist);
    console.warn(
      "[wishlistService] removed duplicate wishlist entries",
      wishlist.length - dedupedWishlist.length
    );
  }

  return dedupedWishlist;
};

const writeWishlist = (wishlist) =>
  storageService.setParsedItem(WISHLIST_KEY, dedupeWishlist(wishlist));

export const listWishlistItems = async () => readWishlist();

export const addWishlistItem = async (book) => {
  if (!book?.id) {
    console.warn("[wishlistService] skipped add, missing book id");
    return readWishlist();
  }

  const wishlist = await readWishlist();
  if (wishlist.some((item) => item.id === book.id)) {
    return wishlist;
  }

  const updated = [...wishlist, book];
  await writeWishlist(updated);
  return updated;
};

export const removeWishlistItem = async (id) => {
  const wishlist = await readWishlist();
  const updated = wishlist.filter((item) => item.id !== id);
  await writeWishlist(updated);
  return updated;
};

export const clearWishlist = async () => {
  await storageService.removeItem(WISHLIST_KEY);
  return [];
};

export const hasWishlistItem = async (id) => {
  const wishlist = await readWishlist();
  return wishlist.some((item) => item.id === id);
};

export const getWishlist = listWishlistItems;
export const addToWishlist = addWishlistItem;
export const removeFromWishlist = removeWishlistItem;
export const isWishlisted = hasWishlistItem;
