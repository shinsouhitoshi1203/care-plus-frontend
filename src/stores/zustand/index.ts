import { create } from "zustand";
import { immer } from "zustand/middleware/immer";

type ZustandStoreProps = {
  version: string;
  loading: boolean;
};

type ZustandStoreMethods = {
  setLoading: (loading: boolean) => void;
};

const zustandStore = create<ZustandStoreProps & ZustandStoreMethods>()(
  immer((set) => ({
    // Props
    version: "1.0.0",
    loading: false,

    // Methods
    setLoading: (loading: boolean) =>
      set((state) => {
        state.loading = loading;
      }),
  }))
);

export default zustandStore;
