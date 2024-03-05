import { Dialog } from "@mui/material";
import {
  StoredImpact,
  StoredImpactCategory,
} from "types/homebrew/HomebrewRules.type";
import { ImpactDialogForm } from "./ImpactDialogForm";

export interface ImpactDialogProps {
  open: boolean;
  onClose: () => void;
  onSave: (impactCategoryId: string, impact: StoredImpact) => Promise<void>;
  impacts: StoredImpactCategory["contents"];
  editingCategoryKey: string;
  editingImpactKey?: string;
}

export function ImpactDialog(props: ImpactDialogProps) {
  const { open, onClose } = props;

  return (
    <Dialog open={open} onClose={onClose} maxWidth={"xs"} fullWidth>
      <ImpactDialogForm {...props} />
    </Dialog>
  );
}
