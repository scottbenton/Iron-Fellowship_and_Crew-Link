import {
  Alert,
  AlertTitle,
  Button,
  ButtonProps,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  MenuItem,
  Stack,
  TextField,
} from "@mui/material";
import { Timestamp } from "firebase/firestore";
import { useState } from "react";
import { StoredTrack, DIFFICULTY } from "../../types/Track.type";

export interface AddTrackDialogProps {
  trackTypeName: string;
  handleTrackAdd: (track: StoredTrack) => Promise<boolean>;
  buttonProps?: ButtonProps;
}

export function AddTrackDialog(props: AddTrackDialogProps) {
  const { trackTypeName, handleTrackAdd, buttonProps } = props;

  const [dialogOpen, setDialogOpen] = useState<boolean>(false);

  const [error, setError] = useState<string>();
  const [loading, setLoading] = useState<boolean>(false);

  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [difficulty, setDifficulty] = useState<DIFFICULTY>();

  const handleDialogClose = () => {
    setName("");
    setDescription("");
    setDifficulty(undefined);
    setError(undefined);
    setLoading(false);
    setDialogOpen(false);
  };

  const handleSubmit = () => {
    if (!name) {
      setError("Name is required");
      return;
    } else if (!difficulty) {
      setError("Difficulty is required");
      return;
    }

    const track: StoredTrack = {
      label: name,
      description,
      difficulty: difficulty,
      value: 0,
      createdTimestamp: Timestamp.fromDate(new Date()),
    };

    setLoading(true);
    handleTrackAdd(track)
      .then(() => {
        handleDialogClose();
      })
      .catch((e) => {
        setLoading(false);
        setError("Error adding track");
      });
  };

  return (
    <>
      <Button
        variant={"outlined"}
        onClick={() => setDialogOpen(true)}
        {...buttonProps}
      >
        Add {trackTypeName}
      </Button>
      <Dialog
        open={dialogOpen}
        onClose={() => handleDialogClose()}
        maxWidth={"xs"}
        fullWidth
      >
        <DialogTitle>Add {trackTypeName}</DialogTitle>
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
              value={description}
              onChange={(evt) => setDescription(evt.target.value)}
              multiline
              minRows={3}
            />
            <TextField
              label={"Difficulty"}
              value={difficulty ?? "-1"}
              onChange={(evt) => setDifficulty(evt.target.value as DIFFICULTY)}
              multiline
              required
              select
            >
              <MenuItem value={"-1"} disabled></MenuItem>

              <MenuItem value={DIFFICULTY.TROUBLESOME}>Troublesome</MenuItem>
              <MenuItem value={DIFFICULTY.DANGEROUS}>Dangerous</MenuItem>
              <MenuItem value={DIFFICULTY.FORMIDABLE}>Formidable</MenuItem>
              <MenuItem value={DIFFICULTY.EXTREME}>Extreme</MenuItem>
              <MenuItem value={DIFFICULTY.EPIC}>Epic</MenuItem>
            </TextField>
          </Stack>
        </DialogContent>
        <DialogActions>
          <Button disabled={loading} onClick={() => handleDialogClose()}>
            Cancel
          </Button>
          <Button
            disabled={loading}
            onClick={() => handleSubmit()}
            variant={"contained"}
          >
            Add {trackTypeName}
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
}
