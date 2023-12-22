import { IconButton, Tooltip } from "@mui/material";
import { PropsWithChildren, ReactNode } from "react";
import BackIcon from "@mui/icons-material/ChevronLeft";
import CopyIcon from "@mui/icons-material/CopyAll";
import { DialogTitleWithCloseButton } from "components/shared/DialogTitleWithCloseButton";
import { getIsLocalEnvironment } from "functions/getGameSystem";
import { useSnackbar } from "providers/SnackbarProvider";

export interface LinkedDialogContentTitleProps extends PropsWithChildren {
  id: string;
  handleBack: () => void;
  handleClose: () => void;
  isLastItem: boolean;
  actions?: ReactNode;
}
export function LinkedDialogContentTitle(props: LinkedDialogContentTitleProps) {
  const { children, id, handleBack, handleClose, isLastItem, actions } = props;

  const { success } = useSnackbar();

  const handleCopy = () => {
    navigator.clipboard.writeText(id).then(() => {
      success("Copied ID to clipboard");
    });
  };

  return (
    <DialogTitleWithCloseButton
      onClose={handleClose}
      actions={
        <>
          {actions}
          {getIsLocalEnvironment() && (
            <Tooltip title={"Copy Id"}>
              <IconButton onClick={handleCopy}>
                <CopyIcon />
              </IconButton>
            </Tooltip>
          )}
          {!isLastItem && (
            <Tooltip title={"Back"}>
              <IconButton
                aria-label={"Back"}
                onClick={() => handleBack()}
                sx={{ flexShrink: 0, marginLeft: 1 }}
              >
                <BackIcon />
              </IconButton>
            </Tooltip>
          )}
        </>
      }
    >
      {children}
    </DialogTitleWithCloseButton>
  );
}
