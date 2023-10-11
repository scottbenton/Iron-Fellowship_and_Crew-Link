import { Box, DialogTitle, IconButton } from "@mui/material";
import { PropsWithChildren, ReactNode } from "react";
import CloseIcon from "@mui/icons-material/Close";

export interface DialogTitleWithCloseButtonProps extends PropsWithChildren {
  onClose: () => void;
  actions?: ReactNode;
}
export function DialogTitleWithCloseButton(
  props: DialogTitleWithCloseButtonProps
) {
  const { children, actions, onClose } = props;

  return (
    <DialogTitle
      display={"flex"}
      alignItems={"center"}
      justifyContent={"space-between"}
    >
      <span>{children}</span>
      <Box display={"flex"} alignItems={"center"} flexShrink={0} ml={1}>
        {actions}
        <IconButton onClick={() => onClose()}>
          <CloseIcon />
        </IconButton>
      </Box>
    </DialogTitle>
  );
}
