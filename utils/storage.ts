import AsyncStorage from '@react-native-async-storage/async-storage';

// Storage keys
export const STORAGE_KEYS = {
  APP_USAGE: 'app_usage',
  USER_CHALLENGES: 'user_challenges',
  USER_PROFILE: 'user_profile',
  REWARDS: 'rewards',
};

/**
 * Save data to AsyncStorage
 * @param key Storage key
 * @param data Data to store
 */
export const saveData = async <T>(key: string, data: T): Promise<void> => {
  try {
    const jsonValue = JSON.stringify(data);
    await AsyncStorage.setItem(key, jsonValue);
  } catch (error) {
    console.error(`Error saving data for key ${key}:`, error);
  }
};

/**
 * Load data from AsyncStorage
 * @param key Storage key
 * @param defaultValue Default value if key doesn't exist
 * @returns Stored data or default value
 */
export const loadData = async <T>(key: string, defaultValue: T): Promise<T> => {
  try {
    const jsonValue = await AsyncStorage.getItem(key);
    return jsonValue !== null ? JSON.parse(jsonValue) : defaultValue;
  } catch (error) {
    console.error(`Error loading data for key ${key}:`, error);
    return defaultValue;
  }
};

/**
 * Remove data from AsyncStorage
 * @param key Storage key
 */
export const removeData = async (key: string): Promise<void> => {
  try {
    await AsyncStorage.removeItem(key);
  } catch (error) {
    console.error(`Error removing data for key ${key}:`, error);
  }
};

/**
 * Clear all app data from AsyncStorage
 */
export const clearAllData = async (): Promise<void> => {
  try {
    const keys = Object.values(STORAGE_KEYS);
    await AsyncStorage.multiRemove(keys);
  } catch (error) {
    console.error('Error clearing all data:', error);
  }
};
