import { Dialog } from "@mui/material";
import { useStore } from "stores/store";
import { LinkedDialogContent } from "./LinkedDialogContent";

export function LinkedDialog() {
  const { isOpen, previousIds, openId } = useStore(
    (store) => store.appState.openDialogState
  );
  const handleBack = useStore((store) => store.appState.prevDialog);
  const handleClose = useStore((store) => store.appState.closeDialog);

  return (
    <Dialog open={isOpen} onClose={handleClose}>
      <LinkedDialogContent
        id={openId}
        isLastItem={previousIds.length === 0}
        handleBack={handleBack}
        handleClose={handleClose}
      />
    </Dialog>
  );
}
