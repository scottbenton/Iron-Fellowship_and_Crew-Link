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

export interface EditOrCreateTrackDialogProps {
  open: boolean;
  handleClose: () => void;
  initialTrack?: StoredTrack;
  trackTypeName: string;
  handleTrack: (track: StoredTrack) => Promise<boolean | void>;
  buttonProps?: ButtonProps;
}

export function EditOrCreateTrackDialog(props: EditOrCreateTrackDialogProps) {
  const {
    open,
    handleClose,
    initialTrack,
    trackTypeName,
    handleTrack,
    buttonProps,
  } = props;

  const [error, setError] = useState<string>();
  const [loading, setLoading] = useState<boolean>(false);

  const [name, setName] = useState(initialTrack?.label ?? "");
  const [description, setDescription] = useState(
    initialTrack?.description ?? ""
  );
  const [difficulty, setDifficulty] = useState<DIFFICULTY | undefined>(
    initialTrack?.difficulty
  );

  const handleDialogClose = () => {
    setName("");
    setDescription("");
    setDifficulty(undefined);
    setError(undefined);
    setLoading(false);
    handleClose();
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
      value: initialTrack?.value ?? 0,
      createdTimestamp: Timestamp.fromDate(new Date()),
    };

    setLoading(true);
    handleTrack(track)
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
      <Dialog open={open} onClose={handleDialogClose} maxWidth={"xs"} fullWidth>
        <DialogTitle>
          {initialTrack ? `Edit ${initialTrack.label}` : `Add ${trackTypeName}`}
        </DialogTitle>
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
          <Button
            disabled={loading}
            onClick={() => handleDialogClose()}
            color={"inherit"}
          >
            Cancel
          </Button>
          <Button
            disabled={loading}
            onClick={() => handleSubmit()}
            variant={"contained"}
          >
            {initialTrack
              ? `Edit ${initialTrack.label}`
              : `Add ${trackTypeName}`}
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
}
