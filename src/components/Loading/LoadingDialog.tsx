import { Dialog } from "@rneui/themed";

function LoadingDialog({ show }: { show: boolean }) {
  return (
    <>
      <Dialog isVisible={show}>
        <Dialog.Loading loadingStyle={{ backgroundColor: "blue" }} />
      </Dialog>
    </>
  );
}
export default LoadingDialog;
