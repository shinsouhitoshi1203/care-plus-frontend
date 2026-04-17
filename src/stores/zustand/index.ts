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

type SubPageState = {
  title?: string;
};

type ZustandStoreProps = {
  version: string;
  loading: boolean;

  behavior: {
    dialog: DialogState;
    subPage: SubPageState;
  };
};

type ZustandStoreMethods = {
  setLoading: (loading: boolean) => void;
  openDialog: (dialogData: Omit<DialogState, "isOpen">) => void;
  toggleDialog: () => void;
  setSubPageTitle: (title: string) => void;
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
        subPage: {
          title: "",
        },
      },

      // Methods
      setLoading: (loading: boolean) =>
        set((state) => {
          state.loading = loading;
        }),

      openDialog(dialogData: Omit<DialogState, "isOpen">) {
        // console.log("Opening dialog with data:", dialogData);
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

      setSubPageTitle(title: string) {
        set((state) => {
          state.behavior.subPage.title = title;
        });
      },
    }))
  )
);

export default useZustandStore;
