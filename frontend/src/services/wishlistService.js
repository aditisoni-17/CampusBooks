import storageService from './storageService';

const WISHLIST_KEY = 'WISHLIST';

const getStoredWishlist = async () => {
  const list = await storageService.getItem(WISHLIST_KEY);
  return Array.isArray(list) ? list : [];
};

const saveWishlist = list => storageService.setItem(WISHLIST_KEY, list);

export const getWishlist = getStoredWishlist;

export const addToWishlist = async book => {
  const wishlist = await getStoredWishlist();
  if (wishlist.find(item => item.id === book.id)) {
    return wishlist;
  }
  const updated = [...wishlist, book];
  await saveWishlist(updated);
  return updated;
};

export const removeFromWishlist = async id => {
  const wishlist = await getStoredWishlist();
  const updated = wishlist.filter(item => item.id !== id);
  await saveWishlist(updated);
  return updated;
};

export const clearWishlist = async () => {
  await storageService.removeItem(WISHLIST_KEY);
  return [];
};

export const isWishlisted = async id => {
  const wishlist = await getStoredWishlist();
  return wishlist.some(item => item.id === id);
};

