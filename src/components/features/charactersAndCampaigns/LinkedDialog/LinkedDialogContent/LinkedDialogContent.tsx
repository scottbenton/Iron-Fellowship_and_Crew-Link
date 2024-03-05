import { DialogContent } from "@mui/material";
import { LinkedDialogContentTitle } from "./LinkedDialogContentTitle";
import { MoveDialogContent } from "./MoveDialogContent";
import { OracleDialogContent } from "./OracleDialogContent";
import { NewOracleDialogContent } from "./NewOracleDialogContent";
import { NewMoveDialogContent } from "./NewMoveDialogContent";

export interface LinkedDialogContentProps {
  id?: string;
  handleBack: () => void;
  handleClose: () => void;
  isLastItem: boolean;
  newVersion?: boolean;
}

export function LinkedDialogContent(props: LinkedDialogContentProps) {
  const { id, handleBack, handleClose, isLastItem, newVersion } = props;

  if (
    id?.startsWith("ironsworn/moves") ||
    id?.startsWith("starforged/moves") ||
    (newVersion && id?.match(/^[^/]*\/moves/))
  ) {
    if (newVersion) {
      return (
        <NewMoveDialogContent
          id={id}
          handleBack={handleBack}
          handleClose={handleClose}
          isLastItem={isLastItem}
        />
      );
    }
    return (
      <MoveDialogContent
        id={id}
        handleBack={handleBack}
        handleClose={handleClose}
        isLastItem={isLastItem}
      />
    );
  }

  if (
    id?.startsWith("ironsworn/oracles") ||
    id?.startsWith("starforged/oracles") ||
    (newVersion && id?.includes("collections/oracles"))
  ) {
    if (newVersion) {
      return (
        <NewOracleDialogContent
          id={id}
          handleBack={handleBack}
          handleClose={handleClose}
          isLastItem={isLastItem}
        />
      );
    }
    return (
      <OracleDialogContent
        id={id}
        handleBack={handleBack}
        handleClose={handleClose}
        isLastItem={isLastItem}
      />
    );
  }

  return (
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
}
