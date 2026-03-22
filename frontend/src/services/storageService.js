import AsyncStorage from "@react-native-async-storage/async-storage";

const getParsedItem = async (key, fallback = null) => {
  const value = await AsyncStorage.getItem(key);
  return value ? JSON.parse(value) : fallback;
};

const setParsedItem = (key, value) =>
  AsyncStorage.setItem(key, JSON.stringify(value));

const removeItem = (key) => AsyncStorage.removeItem(key);

const clearAll = () => AsyncStorage.clear();

const getArray = async (key) => {
  const value = await getParsedItem(key, []);
  return Array.isArray(value) ? value : [];
};

const getObject = async (key) => {
  const value = await getParsedItem(key, {});
  return value && typeof value === "object" && !Array.isArray(value) ? value : {};
};

const getItem = getParsedItem;
const setItem = setParsedItem;
const clear = clearAll;

const storageService = {
  getParsedItem,
  setParsedItem,
  removeItem,
  clearAll,
  getArray,
  getObject,
  getItem,
  setItem,
  clear,
};

export {
  clear,
  clearAll,
  getArray,
  getItem,
  getObject,
  getParsedItem,
  removeItem,
  setItem,
  setParsedItem,
};

export default storageService;
