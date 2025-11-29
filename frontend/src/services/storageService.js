import AsyncStorage from '@react-native-async-storage/async-storage';

const getItem = async key => {
  const value = await AsyncStorage.getItem(key);
  return value ? JSON.parse(value) : null;
};

const setItem = (key, value) => AsyncStorage.setItem(key, JSON.stringify(value));

const removeItem = key => AsyncStorage.removeItem(key);

const clear = () => AsyncStorage.clear();

export default {
  getItem,
  setItem,
  removeItem,
  clear
};

