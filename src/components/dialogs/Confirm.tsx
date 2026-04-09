import useZustandStore from "@/stores/zustand";
import { Dialog } from "@rneui/themed";
import { memo, useCallback, useEffect, useState } from "react";
import { Text } from "react-native";

function ConfirmDialog() {
  const [open, setOpen] = useState(false);
  const [data, setData] = useState({
    title: "",
    message: "",
    confirmText: "Xác nhận",
  });

  useEffect(() => {
    const unsubscribe = useZustandStore.subscribe(
      (state) => state.behavior.dialog.isOpen,
      (isOpen) => {
        setOpen(isOpen);
        if (isOpen) {
          const dialogData = useZustandStore.getState().behavior.dialog;
          setData(dialogData);
        }
      }
    );
    return () => {
      unsubscribe();
    };
  }, []);

  const toggleDialog = useZustandStore((state) => state.toggleDialog);

  const confirmHandler = useCallback(async () => {
    const handler = useZustandStore.getState().behavior.dialog.handler;
    if (handler) await handler();
    toggleDialog();
    return () => {};
  }, [toggleDialog]);

  return (
    <Dialog overlayStyle={{ borderRadius: 10, width: "90%" }} isVisible={open} onBackdropPress={toggleDialog}>
      <Dialog.Title title={data?.title} />
      <Text className="text-xl">{data?.message}</Text>
      <Dialog.Actions>
        <Dialog.Button title="Hủy" type="solid" onPress={toggleDialog} />
        <Dialog.Button title={data?.confirmText} onPress={confirmHandler} />
      </Dialog.Actions>
    </Dialog>
  );
}

export default memo(ConfirmDialog);
