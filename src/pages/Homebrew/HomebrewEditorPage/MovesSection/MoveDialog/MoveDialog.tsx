import { Dialog } from "@mui/material";
import { MoveDialogForm } from "./MoveDialogForm";

export interface MoveDialogProps {
  homebrewId: string;
  categoryId: string;
  existingMoveId?: string;
  open: boolean;
  onClose: () => void;
}

export function MoveDialog(props: MoveDialogProps) {
  const { open, onClose } = props;

  return (
    <Dialog open={open} onClose={onClose}>
      <MoveDialogForm {...props} />
    </Dialog>
  );
}
