import { Dialog, SwipeableDrawer } from "@mui/material";
import { useStore } from "stores/store";
import { LinkedDialogContent } from "./LinkedDialogContent";
import { useIsMobile } from "hooks/useIsMobile";

export function LinkedDialog() {
  const { isOpen, previousIds, openId, newVersion } = useStore(
    (store) => store.appState.openDialogState
  );
  const handleBack = useStore((store) => store.appState.prevDialog);
  const handleClose = useStore((store) => store.appState.closeDialog);

  const isMobile = useIsMobile();

  if (isMobile && newVersion) {
    return (
      <SwipeableDrawer
        anchor={"bottom"}
        open={isOpen}
        onOpen={() => {}}
        disableSwipeToOpen
        disableDiscovery
        onClose={handleClose}
        sx={{ pt: 1 }}
        PaperProps={{
          sx: (theme) => ({
            top: theme.spacing(2),
            borderTopLeftRadius: theme.shape.borderRadius,
            borderTopRightRadius: theme.shape.borderRadius,
          }),
        }}
      >
        <LinkedDialogContent
          id={openId}
          isLastItem={previousIds.length === 0}
          handleBack={handleBack}
          handleClose={handleClose}
          newVersion={newVersion}
        />
      </SwipeableDrawer>
    );
  }

  return (
    <Dialog open={isOpen} onClose={handleClose}>
      <LinkedDialogContent
        id={openId}
        isLastItem={previousIds.length === 0}
        handleBack={handleBack}
        handleClose={handleClose}
        newVersion={newVersion}
      />
    </Dialog>
  );
}
