import { StoredLegacyTrack } from "types/homebrew/HomebrewRules.type";
import { Dialog } from "@mui/material";
import { LegacyTrackDialogForm } from "./LegacyTrackDialogForm";

export interface LegacyTrackDialogProps {
  homebrewId: string;
  legacyTracks: Record<string, StoredLegacyTrack>;
  open: boolean;
  onSave: (legacyTrack: StoredLegacyTrack) => Promise<void>;
  onClose: () => void;
  editingLegacyTrackKey?: string;
}

export function LegacyTrackDialog(props: LegacyTrackDialogProps) {
  const { open, onClose } = props;

  return (
    <Dialog open={open} onClose={onClose} maxWidth={"xs"} fullWidth>
      <LegacyTrackDialogForm {...props} />
    </Dialog>
  );
}
