const webStorage = new Map<string, string>();

const secureStore = {
  async set(key: string, value: string): Promise<void> {
    if (typeof window !== "undefined" && window.localStorage) {
      window.localStorage.setItem(key, value);
      return;
    }

    webStorage.set(key, value);
  },

  async get(key: string): Promise<string | null> {
    if (typeof window !== "undefined" && window.localStorage) {
      return window.localStorage.getItem(key);
    }

    return webStorage.get(key) ?? null;
  },

  async delete(key: string): Promise<void> {
    if (typeof window !== "undefined" && window.localStorage) {
      window.localStorage.removeItem(key);
      return;
    }

    webStorage.delete(key);
  },
};

export default secureStore;
