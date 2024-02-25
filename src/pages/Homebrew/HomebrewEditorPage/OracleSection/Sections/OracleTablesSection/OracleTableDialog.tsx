import { StoredOracleTable } from "types/homebrew/HomebrewOracles.type";
import { Dialog } from "@mui/material";
import { OracleTableSimpleForm } from "./OracleTableSimpleForm";

export interface OracleTableDialogProps {
  homebrewId: string;
  parentCollectionId: string;
  open: boolean;
  onClose: () => void;
  tables: Record<string, StoredOracleTable>;
  editingOracleTableId?: string;
}

export function OracleTableDialog(props: OracleTableDialogProps) {
  const { open, onClose } = props;

  return (
    <Dialog open={open} onClose={onClose}>
      <OracleTableSimpleForm {...props} />
    </Dialog>
  );
}
