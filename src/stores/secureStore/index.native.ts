import * as SecureStore from "expo-secure-store";
const secureStore = {
  async set(key: string, value: string): Promise<void> {
    await SecureStore.setItemAsync(key, value);
  },

  async get(key: string): Promise<string | null> {
    let result = await SecureStore.getItemAsync(key);
    if (result) {
      return result;
    } else {
      return null;
    }
  },

  async delete(key: string): Promise<void> {
    await SecureStore.deleteItemAsync(key);
  },
};

export default secureStore;
