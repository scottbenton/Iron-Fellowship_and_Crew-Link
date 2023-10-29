import { Box, DialogTitle, IconButton, Typography } from "@mui/material";
import {
  PropsWithChildren,
  ReactNode,
  useEffect,
  useRef,
  useState,
} from "react";
import CloseIcon from "@mui/icons-material/Close";
import { useScreenReaderAnnouncement } from "providers/ScreenReaderAnnouncementProvider";

export interface DialogTitleWithCloseButtonProps extends PropsWithChildren {
  onClose: () => void;
  actions?: ReactNode;
}
export function DialogTitleWithCloseButton(
  props: DialogTitleWithCloseButtonProps
) {
  const { children, actions, onClose } = props;

  const { announcement } = useScreenReaderAnnouncement();

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
      <Box
        position={"absolute"}
        width={1}
        height={1}
        padding={0}
        m={-1}
        overflow={"hidden"}
        whiteSpace={"nowrap"}
        border={0}
        sx={{ clip: "rect(0, 0, 0, 0)" }}
        aria-live={"polite"}
        id={"live-dialog-announcement"}
      >
        {changedAnnouncement}
      </Box>
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
