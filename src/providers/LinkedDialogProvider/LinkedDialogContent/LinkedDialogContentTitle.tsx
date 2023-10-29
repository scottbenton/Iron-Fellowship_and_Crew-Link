import { IconButton } from "@mui/material";
import { PropsWithChildren } from "react";
import BackIcon from "@mui/icons-material/ChevronLeft";
import { DialogTitleWithCloseButton } from "components/shared/DialogTitleWithCloseButton";

export interface LinkedDialogContentTitleProps extends PropsWithChildren {
  handleBack: () => void;
  handleClose: () => void;
  isLastItem: boolean;
}
export function LinkedDialogContentTitle(props: LinkedDialogContentTitleProps) {
  const { children, handleBack, handleClose, isLastItem } = props;

  return (
    <DialogTitleWithCloseButton
      onClose={handleClose}
      actions={
        !isLastItem && (
          <IconButton
            aria-label={"Back"}
            onClick={() => handleBack()}
            sx={{ flexShrink: 0, marginLeft: 1 }}
          >
            <BackIcon />
          </IconButton>
        )
      }
    >
      {children}
    </DialogTitleWithCloseButton>
  );
}
