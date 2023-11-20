import { IconButton } from "@mui/material";
import { PropsWithChildren, ReactNode } from "react";
import BackIcon from "@mui/icons-material/ChevronLeft";
import { DialogTitleWithCloseButton } from "components/shared/DialogTitleWithCloseButton";

export interface LinkedDialogContentTitleProps extends PropsWithChildren {
  handleBack: () => void;
  handleClose: () => void;
  isLastItem: boolean;
  actions?: ReactNode;
}
export function LinkedDialogContentTitle(props: LinkedDialogContentTitleProps) {
  const { children, handleBack, handleClose, isLastItem, actions } = props;

  return (
    <DialogTitleWithCloseButton
      onClose={handleClose}
      actions={
        <>
          {actions}
          {!isLastItem && (
            <IconButton
              aria-label={"Back"}
              onClick={() => handleBack()}
              sx={{ flexShrink: 0, marginLeft: 1 }}
            >
              <BackIcon />
            </IconButton>
          )}
        </>
      }
    >
      {children}
    </DialogTitleWithCloseButton>
  );
}
