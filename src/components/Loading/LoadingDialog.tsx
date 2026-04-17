import { Dialog } from "@rneui/themed";

function LoadingDialog({ show }: { show: boolean }) {
  return (
    <>
      <Dialog isVisible={show}>
        <Dialog.Loading loadingStyle={{ color: "blue" } as any} />
      </Dialog>
    </>
  );
}
export default LoadingDialog;
