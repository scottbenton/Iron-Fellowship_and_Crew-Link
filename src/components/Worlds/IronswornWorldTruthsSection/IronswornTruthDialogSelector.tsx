import { Button, Dialog, DialogActions, DialogContent } from "@mui/material";
import { DialogTitleWithCloseButton } from "components/DialogTitleWithCloseButton";
import { IronswornWorldTruthChooser } from "./IronswornWorldTruthChooser";
import { TruthClassic } from "dataforged";
import { Truth, TRUTH_IDS } from "types/World.type";

export interface IronswornTruthDialogSelectorProps {
  open: boolean;
  handleClose: () => void;
  truthId: TRUTH_IDS;
  truth: TruthClassic;
  storedTruth: Truth;
}

export function IronswornTruthDialogSelector(
  props: IronswornTruthDialogSelectorProps
) {
  const { open, handleClose, truth, storedTruth, truthId } = props;

  return (
    <Dialog open={open} onClose={() => handleClose()}>
      <DialogTitleWithCloseButton onClose={() => handleClose()}>
        Edit {truth.Title.Standard}
      </DialogTitleWithCloseButton>
      <DialogContent>
        <IronswornWorldTruthChooser
          truthId={truthId}
          initialTruth={storedTruth}
          maxCols={2}
        />
      </DialogContent>
      <DialogActions>
        <Button variant={"contained"} onClick={() => handleClose()}>
          Save Changes
        </Button>
      </DialogActions>
    </Dialog>
  );
}
