import secureStore from "@/stores/secureStore";
import { createAsyncStoragePersister } from "@tanstack/query-async-storage-persister";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { PersistQueryClientProvider } from "@tanstack/react-query-persist-client";
import { createElement, ReactNode, useEffect, useState } from "react";
import { createMMKV, type MMKV } from "react-native-mmkv";
import { TANSTACK_QUERY_CACHE_TIME, TANSTACK_QUERY_CONFIG } from "./config";

const tanstackClient = new QueryClient(TANSTACK_QUERY_CONFIG);

const TANSTACK_MMKV_ID = "tanstack.query.cache";
const TANSTACK_MMKV_KEY_SECURE_STORE_KEY = "tanstack.mmkv.encryptionKey";
const TANSTACK_PERSIST_KEY = "tanstack.react-query.persist";
const MMKV_ENCRYPTION_KEY_LENGTH = 16;

const MMKV_KEY_CHARSET = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";

function generateMMKVEncryptionKey(length = MMKV_ENCRYPTION_KEY_LENGTH): string {
  let key = "";
  for (let index = 0; index < length; index += 1) {
    const randomIndex = Math.floor(Math.random() * MMKV_KEY_CHARSET.length);
    key += MMKV_KEY_CHARSET[randomIndex];
  }

  return key;
}

async function getMMKVEncryptionKey(): Promise<string> {
  const savedKey = await secureStore.get(TANSTACK_MMKV_KEY_SECURE_STORE_KEY);
  if (savedKey && savedKey.length === MMKV_ENCRYPTION_KEY_LENGTH) {
    return savedKey;
  }

  const generatedKey = generateMMKVEncryptionKey();
  await secureStore.set(TANSTACK_MMKV_KEY_SECURE_STORE_KEY, generatedKey);
  return generatedKey;
}

function createMMKVAsyncStorage(storage: MMKV) {
  return {
    getItem: async (key: string) => storage.getString(key) ?? null,
    setItem: async (key: string, value: string) => {
      storage.set(key, value);
    },
    removeItem: async (key: string) => {
      storage.remove(key);
    },
  };
}

type TanstackPersister = ReturnType<typeof createAsyncStoragePersister>;

let tanstackPersisterPromise: Promise<TanstackPersister> | null = null;

export const initializeTanstackPersistence = async (): Promise<TanstackPersister> => {
  if (!tanstackPersisterPromise) {
    tanstackPersisterPromise = (async () => {
      const mmkvEncryptionKey = await getMMKVEncryptionKey();

      const mmkvStorage = createMMKV({
        id: TANSTACK_MMKV_ID,
        encryptionKey: mmkvEncryptionKey,
        encryptionType: "AES-256",
      });

      return createAsyncStoragePersister({
        storage: createMMKVAsyncStorage(mmkvStorage),
        key: TANSTACK_PERSIST_KEY,
      });
    })();
  }

  return tanstackPersisterPromise;
};

export const removeTanstackPersistedCache = async (): Promise<void> => {
  const persister = await initializeTanstackPersistence();
  await persister.removeClient();
};

function getRestoredQueryDebugInfo() {
  const restoredQueries = tanstackClient.getQueryCache().getAll();
  return {
    restoredQueryCount: restoredQueries.length,
    restoredPersistedQueryKeys: restoredQueries
      .filter((query) => query.meta?.persist === true)
      .map((query) => JSON.stringify(query.queryKey)),
  };
}

type TanstackProviderProps = {
  children: ReactNode;
  fallback?: ReactNode;
  persistToMMKV?: boolean;
};

export function TanstackProvider({ children, fallback = null, persistToMMKV = true }: TanstackProviderProps) {
  const [persister, setPersister] = useState<TanstackPersister | null>(null);
  const [isReady, setIsReady] = useState(!persistToMMKV);

  useEffect(() => {
    let isMounted = true;

    if (!persistToMMKV) {
      setPersister(null);
      setIsReady(true);
      return () => {
        isMounted = false;
      };
    }

    setIsReady(false);

    void initializeTanstackPersistence()
      .then((resolvedPersister) => {
        if (!isMounted) return;
        setPersister(resolvedPersister);
      })
      .catch((error) => {
        console.warn("[tanstack] Failed to initialize persisted cache", error);
      })
      .finally(() => {
        if (!isMounted) return;
        setIsReady(true);
      });

    return () => {
      isMounted = false;
    };
  }, [persistToMMKV]);

  if (!isReady) {
    return fallback;
  }

  if (!persistToMMKV || !persister) {
    return createElement(QueryClientProvider, { client: tanstackClient }, children);
  }

  return createElement(
    PersistQueryClientProvider,
    {
      client: tanstackClient,
      persistOptions: {
        persister,
        maxAge: TANSTACK_QUERY_CACHE_TIME,
        dehydrateOptions: {
          // Persist only queries that explicitly opt in with `meta.persist`.
          shouldDehydrateQuery: (query) => query.meta?.persist === true,
        },
      },
      onSuccess: () => {
        console.log("[tanstack] Cache rehydration complete", {
          storageKey: TANSTACK_PERSIST_KEY,
          ...getRestoredQueryDebugInfo(),
        });
        // console.log();

        // console.log(tanstackClient.getQueryCache().getAll());
      },
      onError: () => {
        console.warn("[tanstack] Cache rehydration failed");
      },
    },
    children
  );
}

export default tanstackClient;
