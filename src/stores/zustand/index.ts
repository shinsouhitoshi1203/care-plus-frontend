import { create } from "zustand";
import { subscribeWithSelector } from "zustand/middleware";
import { immer } from "zustand/middleware/immer";

type DialogState = {
  isOpen: boolean;
  title: string;
  message: string;
  confirmText: string;
  handler?: () => void | Promise<void>;
};

type ZustandStoreProps = {
  version: string;
  loading: boolean;

  behavior: {
    dialog: DialogState;
  };
};

type ZustandStoreMethods = {
  setLoading: (loading: boolean) => void;
  openDialog: (dialogData: Omit<DialogState, "isOpen">) => void;
  toggleDialog: () => void;
};

const useZustandStore = create<ZustandStoreProps & ZustandStoreMethods>()(
  subscribeWithSelector(
    immer((set) => ({
      // Props
      version: "1.0.0",
      loading: false,

      behavior: {
        dialog: {
          isOpen: false,
          title: "",
          message: "",
          confirmText: "",
          handler: () => {},
        },
      },

      // Methods
      setLoading: (loading: boolean) =>
        set((state) => {
          state.loading = loading;
        }),

      openDialog(dialogData: Omit<DialogState, "isOpen">) {
        console.log("Opening dialog with data:", dialogData);
        set((state) => {
          state.behavior.dialog.isOpen = true;
          state.behavior.dialog.title = dialogData.title;
          state.behavior.dialog.message = dialogData.message;
          state.behavior.dialog.confirmText = dialogData.confirmText;
          state.behavior.dialog.handler = dialogData.handler;
        });
      },

      toggleDialog() {
        set((state) => {
          state.behavior.dialog.isOpen = !state.behavior.dialog.isOpen;
        });
      },
    }))
  )
);

export default useZustandStore;
