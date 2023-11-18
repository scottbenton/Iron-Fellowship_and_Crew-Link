import { Box, DialogTitle, IconButton, Typography } from "@mui/material";
import {
  PropsWithChildren,
  ReactNode,
  useEffect,
  useRef,
  useState,
} from "react";
import CloseIcon from "@mui/icons-material/Close";
import { useStore } from "stores/store";
import { ScreenReaderOnly } from "./ScreenReaderOnly";

export interface DialogTitleWithCloseButtonProps extends PropsWithChildren {
  onClose: () => void;
  actions?: ReactNode;
}
export function DialogTitleWithCloseButton(
  props: DialogTitleWithCloseButtonProps
) {
  const { children, actions, onClose } = props;

  const announcement = useStore(
    (store) => store.appState.screenReaderAnnouncement
  );

  const [changedAnnouncement, setChangedAnnouncement] = useState<
    string | undefined
  >();
  const isFirstLoadRef = useRef(true);
  useEffect(() => {
    if (!isFirstLoadRef.current) {
      setChangedAnnouncement(announcement);
    }
    isFirstLoadRef.current = false;
  }, [announcement]);

  return (
    <>
      <ScreenReaderOnly id={"dialog-live-region"} live>
        {changedAnnouncement}
      </ScreenReaderOnly>
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
    </>
  );
}
