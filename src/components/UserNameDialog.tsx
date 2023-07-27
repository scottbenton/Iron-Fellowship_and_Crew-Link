import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  TextField,
  Typography,
} from "@mui/material";
import { LoadingButton } from "@mui/lab";
import { useSnackbar } from "hooks/useSnackbar";
import { updateUserName } from "lib/auth.lib";
import { useState } from "react";

export interface UserNameDialogProps {
  open: boolean;
  handleClose: () => void;
}

export function UserNameDialog(props: UserNameDialogProps) {
  const { open, handleClose } = props;
  const { error } = useSnackbar();

  const [name, setName] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSave = () => {
    if (name.trim().length > 0) {
      setIsLoading(true);
      updateUserName(name)
        .then(() => {
          handleClose();
        })
        .catch((e) => {
          error("Failed to update name");
          handleClose();
        })
        .finally(() => {
          setIsLoading(false);
        });
    } else {
      error("Name is required.");
    }
  };

  return (
    <Dialog open={open} onClose={() => {}}>
      <DialogTitle>We didn't catch your name</DialogTitle>
      <DialogContent>
        <Typography>
          Add a username so that other players in campaigns you join know who
          you are.
        </Typography>
        <TextField
          label={"Username"}
          value={name}
          onChange={(evt) => setName(evt.currentTarget.value)}
          sx={{ mt: 4 }}
        />
      </DialogContent>
      <DialogActions>
        <LoadingButton
          loading={isLoading}
          variant={"contained"}
          color={"primary"}
          onClick={() => handleSave()}
        >
          Set Name
        </LoadingButton>
      </DialogActions>
    </Dialog>
  );
}
