import {
  Alert,
  AlertTitle,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Stack,
  TextField,
} from "@mui/material";
import { useAddCampaignCustomMove } from "api/campaign/settings/moves/addCampaignCustomMove";
import { useState } from "react";
import { Move } from "types/Moves.type";

export interface AddCustomMoveDialogProps {
  open: boolean;
  setClose: () => void;
  campaignId: string;
}

export function AddCustomMoveDialog(props: AddCustomMoveDialogProps) {
  const { open, setClose, campaignId } = props;

  const [error, setError] = useState<string>();
  const [loading, setLoading] = useState<boolean>(false);
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");

  const { addCampaignCustomMove } = useAddCampaignCustomMove();

  const handleClose = () => {
    setClose();
    setName("");
    setDescription("");
    setError(undefined);
  };

  const handleSubmit = () => {
    if (!name) {
      setError("Name is required");
      return;
    } else if (!description) {
      setError("Description is required");
      return;
    }

    const customMove: Move = {
      name,
      text: description,
    };

    setLoading(true);
    addCampaignCustomMove({
      campaignId,
      customMove,
    })
      .then(() => handleClose())
      .catch((e) => {
        setError("Error adding custom move");
      });
    setLoading(false);
  };

  return (
    <Dialog open={open} onClose={handleClose} maxWidth={"xs"} fullWidth>
      <DialogTitle>Add Custom Move</DialogTitle>
      <DialogContent>
        <Stack spacing={2}>
          {error && (
            <Alert severity="error">
              <AlertTitle>Error</AlertTitle>
              {error}
            </Alert>
          )}
          <TextField
            label={"Name"}
            required
            value={name}
            onChange={(evt) => setName(evt.target.value)}
            sx={{ mt: 1 }}
          />
          <TextField
            label={"Description"}
            required
            value={description}
            onChange={(evt) => setDescription(evt.target.value)}
            multiline
            minRows={6}
          />
        </Stack>
      </DialogContent>
      <DialogActions>
        <Button disabled={loading} onClick={handleClose}>
          Cancel
        </Button>
        <Button
          disabled={loading}
          onClick={() => handleSubmit()}
          variant={"contained"}
        >
          Add Custom Move
        </Button>
      </DialogActions>
    </Dialog>
  );
}
