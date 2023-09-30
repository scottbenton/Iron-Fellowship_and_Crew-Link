import { DialogTitle, IconButton } from "@mui/material";
import { PropsWithChildren } from "react";
import CloseIcon from "@mui/icons-material/Close";

export interface DialogTitleWithCloseButtonProps extends PropsWithChildren {
  onClose: () => void;
}
export function DialogTitleWithCloseButton(
  props: DialogTitleWithCloseButtonProps
) {
  const { children, onClose } = props;

  return (
    <DialogTitle
      display={"flex"}
      alignItems={"center"}
      justifyContent={"space-between"}
    >
      <span>{children}</span>
      <IconButton
        onClick={() => onClose()}
        sx={{ flexShrink: 0, marginLeft: 1 }}
      >
        <CloseIcon />
      </IconButton>
    </DialogTitle>
  );
}
