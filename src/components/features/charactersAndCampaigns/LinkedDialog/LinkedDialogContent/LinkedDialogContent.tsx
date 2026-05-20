import { DialogContent } from "@mui/material";
import { LinkedDialogContentTitle } from "./LinkedDialogContentTitle";
import { OracleDialogContent } from "./OracleDialogContent";
import { MoveDialogContent } from "./MoveDialogContent";
import { AssetDialogContent } from "./AssetDialogContent";

export interface LinkedDialogContentProps {
  id?: string;
  handleBack: () => void;
  handleClose: () => void;
  isLastItem: boolean;
}

export function LinkedDialogContent(props: LinkedDialogContentProps) {
  const { id, handleBack, handleClose, isLastItem } = props;

  const unsupportedContent = (
    <>
      <LinkedDialogContentTitle
        id={id ?? ""}
        handleBack={handleBack}
        handleClose={handleClose}
        isLastItem={isLastItem}
      >
        Not Supported
      </LinkedDialogContentTitle>
      <DialogContent>
        Sorry. Displaying this item is not yet supported by our application.
      </DialogContent>
    </>
  );

  if (!id) {
    return unsupportedContent;
  }

  if (matchId(id, "move")) {
    return (
      <MoveDialogContent
        id={id}
        handleBack={handleBack}
        handleClose={handleClose}
        isLastItem={isLastItem}
      />
    );
  }

  if (matchId(id, "oracle_collection") || matchId(id, "oracle_rollable")) {
    return (
      <OracleDialogContent
        id={id}
        handleBack={handleBack}
        handleClose={handleClose}
        isLastItem={isLastItem}
      />
    );
  }

  if (matchId(id, "asset")) {
    return (
      <AssetDialogContent
        id={id}
        handleBack={handleBack}
        handleClose={handleClose}
        isLastItem={isLastItem}
      />
    );
  }

  return unsupportedContent;
}

function matchId(id: string | undefined, type: string) {
  if (!id) return false;
  const regex = new RegExp(`^[^:]*${type}`);
  return id.match(regex);
}
