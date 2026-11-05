import { Box, DialogTitle, IconButton, Typography } from "@mui/material";
import {
  PropsWithChildren,
  ReactNode,
  useId,
  useLayoutEffect,
  useRef,
} from "react";
import CloseIcon from "@mui/icons-material/Close";
import { LiveRegion } from "./LiveRegion";

export interface DialogTitleWithCloseButtonProps extends PropsWithChildren {
  onClose: () => void;
  actions?: ReactNode;
}
export function DialogTitleWithCloseButton(
  props: DialogTitleWithCloseButtonProps
) {
  const { children, actions, onClose } = props;

  // MUI names the dialog after the whole title bar, which would make its name
  // end in "Close Dialog" and any other buttons here. Point the dialog at the
  // heading alone instead.
  const titleId = useId();
  const titleRef = useRef<HTMLHeadingElement>(null);
  useLayoutEffect(() => {
    titleRef.current
      ?.closest("[role='dialog']")
      ?.setAttribute("aria-labelledby", titleId);
  }, [titleId]);

  return (
    <>
      <LiveRegion />
      <DialogTitle
        display={"flex"}
        alignItems={"center"}
        justifyContent={"space-between"}
        component={"div"}
      >
        <Typography variant={"h6"} component={"h2"} id={titleId} ref={titleRef}>
          {children}
        </Typography>
        <Box display={"flex"} alignItems={"center"} flexShrink={0} ml={1}>
          {actions}
          <IconButton aria-label={"Close Dialog"} onClick={() => onClose()}>
            <CloseIcon />
          </IconButton>
        </Box>
      </DialogTitle>
    </>
  );
}
