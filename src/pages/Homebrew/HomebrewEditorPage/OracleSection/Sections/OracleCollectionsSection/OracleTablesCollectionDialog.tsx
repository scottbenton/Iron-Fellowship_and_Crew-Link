import { Dialog } from "@mui/material";
import { StoredOracleCollection } from "types/homebrew/HomebrewOracles.type";
import { OracleTablesCollectionDialogForm } from "./OracleTablesCollectionDialogForm";

export interface OracleTablesCollectionDialogProps {
  homebrewId: string;
  open: boolean;
  onClose: () => void;

  collections: Record<string, StoredOracleCollection>;
  existingCollectionId?: string;

  parentCollectionId?: string;
}

export function OracleTablesCollectionDialog(
  props: OracleTablesCollectionDialogProps
) {
  const { open, onClose } = props;

  return (
    <Dialog open={open} onClose={onClose}>
      <OracleTablesCollectionDialogForm {...props} />
    </Dialog>
  );
}
