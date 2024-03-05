import { Dialog } from "@mui/material";
import { MoveCategoryDialogForm } from "./MoveCategoryDialogForm";

export interface MoveCategoryDialogProps {
  homebrewId: string;
  existingMoveCategoryId?: string;
  open: boolean;
  onClose: () => void;
}

export function MoveCategoryDialog(props: MoveCategoryDialogProps) {
  const { open, onClose } = props;

  return (
    <Dialog open={open} onClose={onClose}>
      <MoveCategoryDialogForm {...props} />
    </Dialog>
  );
}
