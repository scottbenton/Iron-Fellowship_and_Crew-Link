import { StoredStat } from "types/homebrew/HomebrewRules.type";
import { Dialog } from "@mui/material";
import { StatDialogForm } from "./StatDialogForm";

export interface StatDialogProps {
  homebrewId: string;
  stats: Record<string, StoredStat>;
  open: boolean;
  onSave: (stat: StoredStat) => Promise<void>;
  onClose: () => void;
  editingStatKey?: string;
}

export function StatDialog(props: StatDialogProps) {
  const { open, onClose } = props;

  return (
    <Dialog open={open} onClose={onClose} maxWidth={"xs"} fullWidth>
      <StatDialogForm {...props} />
    </Dialog>
  );
}
