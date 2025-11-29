import AsyncStorage from '@react-native-async-storage/async-storage';
import mockBooks from '../src/data/mockBooks';

const STORAGE_KEYS = {
    LISTINGS: 'campusbooks_listings',
    WISHLIST: 'campusbooks_wishlist',
};

export const getListings = async () => {
    try {
        const jsonValue = await AsyncStorage.getItem(STORAGE_KEYS.LISTINGS);
        if (jsonValue != null) {
            return JSON.parse(jsonValue);
        } else {
            await AsyncStorage.setItem(STORAGE_KEYS.LISTINGS, JSON.stringify(mockBooks));
            return mockBooks;
        }
    } catch (e) {
        console.error('Error fetching listings:', e);
        return [];
    }
};

export const addListing = async (listing) => {
    try {
        const listings = await getListings();
        const newListing = { ...listing, id: Date.now().toString() };
        const updatedListings = [newListing, ...listings];
        await AsyncStorage.setItem(STORAGE_KEYS.LISTINGS, JSON.stringify(updatedListings));
        return newListing;
    } catch (e) {
        console.error('Error adding listing:', e);
        throw e;
    }
};

export const updateListing = async (id, updates) => {
    try {
        const listings = await getListings();
        const updatedListings = listings.map((item) =>
            item.id === id ? { ...item, ...updates } : item
        );
        await AsyncStorage.setItem(STORAGE_KEYS.LISTINGS, JSON.stringify(updatedListings));
        return updatedListings.find((item) => item.id === id);
    } catch (e) {
        console.error('Error updating listing:', e);
        throw e;
    }
};

export const deleteListing = async (id) => {
    try {
        const listings = await getListings();
        const updatedListings = listings.filter((item) => item.id !== id);
        await AsyncStorage.setItem(STORAGE_KEYS.LISTINGS, JSON.stringify(updatedListings));
        return true;
    } catch (e) {
        console.error('Error deleting listing:', e);
        throw e;
    }
};

export const getWishlist = async () => {
    try {
        const jsonValue = await AsyncStorage.getItem(STORAGE_KEYS.WISHLIST);
        return jsonValue != null ? JSON.parse(jsonValue) : [];
    } catch (e) {
        console.error('Error fetching wishlist:', e);
        return [];
    }
};

export const addToWishlist = async (bookId) => {
    try {
        const wishlist = await getWishlist();
        if (!wishlist.includes(bookId)) {
            const updatedWishlist = [...wishlist, bookId];
            await AsyncStorage.setItem(STORAGE_KEYS.WISHLIST, JSON.stringify(updatedWishlist));
        }
        return true;
    } catch (e) {
        console.error('Error adding to wishlist:', e);
        throw e;
    }
};

export const removeFromWishlist = async (bookId) => {
    try {
        const wishlist = await getWishlist();
        const updatedWishlist = wishlist.filter((id) => id !== bookId);
        await AsyncStorage.setItem(STORAGE_KEYS.WISHLIST, JSON.stringify(updatedWishlist));
        return true;
    } catch (e) {
        console.error('Error removing from wishlist:', e);
        throw e;
    }
};


export const uploadImage = async (uri) => {
    return uri;
};

export const clearAllData = async () => {
    try {
        await AsyncStorage.clear();
        console.log('Storage cleared');
    } catch (e) {
        console.error('Error clearing storage', e);
    }
};