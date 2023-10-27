import { Box, DialogTitle, IconButton, Typography } from "@mui/material";
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
      component={"div"}
    >
      <Typography variant={"h6"} component={"h2"}>
        {children}
      </Typography>
      <Box display={"flex"} alignItems={"center"} flexShrink={0} ml={1}>
        {actions}
        <IconButton aria-label={"Close Dialog"} onClick={() => onClose()}>
          <CloseIcon />
        </IconButton>
      </Box>
    </DialogTitle>
  );
}
