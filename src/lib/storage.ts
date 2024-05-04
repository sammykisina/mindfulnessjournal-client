import AsyncStorage from '@react-native-async-storage/async-storage';

/**
 * === LOCAL STORAGE ===
 */

/**
 * SETTING ITEM INTO LOCAL STORAGE
 * @param key
 * @param value
 */
export const storeToLocalStorage = async <T>(key: string, value: T) => {
  try {
    await AsyncStorage.setItem(key, JSON.stringify(value));
  } catch (error) {
    console.error('Error setting data to AsyncStorage:', error);
  }
};

/**
 * READ ITEM FROM LOCAL STORAGE
 * @param key
 * @returns T
 */
export const getFromLocalStorage = async (key: string) => {
  try {
    const value = await AsyncStorage.getItem(key);
    if (value !== null) {
      return JSON.parse(value);
    }
  } catch (error) {
    console.error('Error loading data from AsyncStorage:', error);
  }
};

/**
 * DELETE ITEM FROM LOCAL STORAGE
 * @param key
 * @returns T
 */
export const deleteFromLocalStorage = async (key: string) => {
  try {
    await AsyncStorage.removeItem(key);
  } catch (error) {
    console.error('Error deleting from AsyncStorage:', error);
  }
};

/**
 * DELETE ALL ITEMS FROM LOCAL STORAGE
 * @param key
 * @returns T
 */
export const deleteAllFromLocalStorage = async () => {
  try {
    await AsyncStorage.clear();
  } catch (error) {
    console.error('Error deleting all from AsyncStorage:', error);
  }
};
