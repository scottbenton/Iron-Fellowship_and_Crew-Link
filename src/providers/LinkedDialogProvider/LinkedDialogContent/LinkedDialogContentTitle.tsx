import { Box, DialogTitle, IconButton } from "@mui/material";
import { PropsWithChildren } from "react";
import CloseIcon from "@mui/icons-material/Close";
import BackIcon from "@mui/icons-material/ChevronLeft";

export interface LinkedDialogContentTitleProps extends PropsWithChildren {
  handleBack: () => void;
  handleClose: () => void;
  isLastItem: boolean;
}
export function LinkedDialogContentTitle(props: LinkedDialogContentTitleProps) {
  const { children, handleBack, handleClose, isLastItem } = props;

  return (
    <DialogTitle
      display={"flex"}
      alignItems={"center"}
      justifyContent={"space-between"}
    >
      <span>{children}</span>
      <Box>
        {!isLastItem && (
          <IconButton
            onClick={() => handleBack()}
            sx={{ flexShrink: 0, marginLeft: 1 }}
          >
            <BackIcon />
          </IconButton>
        )}
        <IconButton
          onClick={() => handleClose()}
          sx={{ flexShrink: 0, marginLeft: 1 }}
        >
          <CloseIcon />
        </IconButton>
      </Box>
    </DialogTitle>
  );
}
