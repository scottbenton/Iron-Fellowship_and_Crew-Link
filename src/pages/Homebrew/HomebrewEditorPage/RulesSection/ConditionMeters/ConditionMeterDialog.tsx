import { Dialog } from "@mui/material";
import { StoredConditionMeter } from "types/homebrew/HomebrewRules.type";
import { ConditionMeterDialogForm } from "./ConditionMeterDialogForm";

export interface ConditionMeterDialogProps {
  homebrewId: string;
  conditionMeters: Record<string, StoredConditionMeter>;
  open: boolean;
  onSave: (conditionMeter: StoredConditionMeter) => Promise<void>;
  onClose: () => void;
  editingConditionMeterKey?: string;
}

export function ConditionMeterDialog(props: ConditionMeterDialogProps) {
  const { open, onClose } = props;

  return (
    <Dialog open={open} onClose={onClose} maxWidth={"xs"} fullWidth>
      <ConditionMeterDialogForm {...props} />
    </Dialog>
  );
}
