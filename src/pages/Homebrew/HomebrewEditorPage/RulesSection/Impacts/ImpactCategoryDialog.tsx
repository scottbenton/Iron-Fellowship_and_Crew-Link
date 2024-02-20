import { StoredImpactCategory } from "types/homebrew/HomebrewRules.type";
import { Dialog } from "@mui/material";
import { ImpactCategoryDialogForm } from "./ImpactCategoryDialogForm";

export interface ImpactCategoryDialogProps {
  homebrewId: string;
  open: boolean;
  onClose: () => void;
  onSave: (impactCategory: StoredImpactCategory) => Promise<void>;
  impactCategories: Record<string, StoredImpactCategory>;
  editingCategoryKey?: string;
}

export function ImpactCategoryDialog(props: ImpactCategoryDialogProps) {
  const { open, onClose } = props;

  return (
    <Dialog open={open} onClose={onClose} maxWidth={"xs"} fullWidth>
      <ImpactCategoryDialogForm {...props} />
    </Dialog>
  );
}
