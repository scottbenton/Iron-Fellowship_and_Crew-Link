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
import { useRemoveCampaignCustomMove } from "api/campaign/settings/moves/removeCampaignCustomMove";
import { useEffect, useState } from "react";
import { Move } from "types/Moves.type";

export interface CustomMoveDialogProps {
  open: boolean;
  setClose: () => void;
  campaignId: string;
  oldMove?: Move;
}

export function CustomMoveDialog(props: CustomMoveDialogProps) {
  const { open, setClose, campaignId, oldMove } = props;

  const [error, setError] = useState<string>();
  const [loading, setLoading] = useState<boolean>(false);
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");

  const { addCampaignCustomMove } = useAddCampaignCustomMove();
  const { removeCampaignCustomMove } = useRemoveCampaignCustomMove();

  const handleClose = () => {
    setClose();
    setError(undefined);
  };

  useEffect(() => {
    setName(oldMove?.name || "");
    setDescription(oldMove?.text || "");
  }, [oldMove, open]);

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

    if (oldMove) {
      removeCampaignCustomMove({
        campaignId,
        customMove: oldMove,
      })
        .then(() => handleClose())
        .catch((e) => {
          setError("Error removing old custom move");
        });
    }

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
