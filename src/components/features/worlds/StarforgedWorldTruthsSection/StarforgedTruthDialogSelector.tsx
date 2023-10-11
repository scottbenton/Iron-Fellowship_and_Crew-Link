import { Button, Dialog, DialogActions, DialogContent } from "@mui/material";
import {
  StarforgedTruthChooser,
  StarforgedTruthChooserProps,
} from "./StarforgedTruthChooser";
import { DialogTitleWithCloseButton } from "components/shared/DialogTitleWithCloseButton";

export interface StarforgedTruthDialogSelectorProps
  extends StarforgedTruthChooserProps {
  open: boolean;
  handleClose: () => void;
}

export function StarforgedTruthDialogSelector(
  props: StarforgedTruthDialogSelectorProps
) {
  const { open, handleClose, ...chooserProps } = props;

  return (
    <Dialog open={open} onClose={handleClose}>
      <DialogTitleWithCloseButton onClose={handleClose}>
        Title
      </DialogTitleWithCloseButton>
      <DialogContent>
        <StarforgedTruthChooser {...chooserProps} maxCols={2} />
      </DialogContent>
      <DialogActions>
        <Button variant={"contained"} onClick={handleClose}>
          Done
        </Button>
      </DialogActions>
    </Dialog>
  );
}
