import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
} from "@mui/material";
import { DialogTitleWithCloseButton } from "components/shared/DialogTitleWithCloseButton";
import { OracleSection } from "components/features/charactersAndCampaigns/OracleSection";
import React from "react";

export interface HideOraclesDialogProps {
  open: boolean;
  onClose: () => void;
}

export function HideOraclesDialog(props: HideOraclesDialogProps) {
  const { open, onClose } = props;

  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitleWithCloseButton onClose={onClose}>
        Hide Oracles
      </DialogTitleWithCloseButton>
      <DialogContent
        sx={(theme) => ({
          overflowY: "scroll",
          scrollbarColor: `${theme.palette.divider} rgba(0, 0, 0, 0)`,
          scrollbarWidth: "thin",
          p: 0,
          pl: 1,
          mb: 1
        })}
      >
        <OracleSection actionIsHide/>
      </DialogContent>
      <DialogActions>
        <Button variant={"contained"} onClick={onClose}>
          Done
        </Button>
      </DialogActions>
    </Dialog>
  );
}
