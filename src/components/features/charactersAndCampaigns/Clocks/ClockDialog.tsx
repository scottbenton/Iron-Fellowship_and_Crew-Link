import {
  Alert,
  AlertTitle,
  Box,
  Button,
  Card,
  CardActionArea,
  Dialog,
  DialogActions,
  DialogContent,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import { DialogTitleWithCloseButton } from "components/shared/DialogTitleWithCloseButton";
import { useState } from "react";
import { Clock, TRACK_STATUS, TRACK_TYPES } from "types/Track.type";
import { ClockCircle } from "./ClockCircle";

const segmentOptions = [4, 6, 8, 10];

export interface ClockDialogProps {
  open: boolean;
  handleClose: () => void;
  initialClock?: Clock;
  onClock: (clock: Clock) => Promise<void>;
  shared?: boolean;
}

export function ClockDialog(props: ClockDialogProps) {
  const { open, handleClose, initialClock, onClock, shared } = props;

  const [error, setError] = useState<string>();
  const [loading, setLoading] = useState(false);

  const [title, setTitle] = useState(initialClock?.label ?? "");
  const [description, setDescription] = useState(
    initialClock?.description ?? ""
  );
  const [segments, setSegments] = useState<number | undefined>(
    initialClock?.segments
  );

  const handleDialogClose = () => {
    setTitle("");
    setDescription("");
    setSegments(undefined);
    setError(undefined);
    setLoading(false);
    handleClose();
  };

  const handleSubmit = () => {
    if (!title) {
      setError("Title is required");
      return;
    } else if (!segments) {
      setError("Please select the number of clock segments you want.");
      return;
    }

    const clock: Clock = {
      createdDate: new Date(),
      status: TRACK_STATUS.ACTIVE,
      type: TRACK_TYPES.CLOCK,
      ...(initialClock ?? {}),
      label: title,
      description,
      segments,
      value: initialClock?.value ?? 0,
    };

    setLoading(true);

    onClock(clock)
      .then(() => {
        handleDialogClose();
      })
      .catch(() => {
        setLoading(false);
        setError("Error creating clock");
      });
  };

  return (
    <Dialog open={open} onClose={handleDialogClose} maxWidth={"xs"} fullWidth>
      <DialogTitleWithCloseButton onClose={handleDialogClose}>
        {initialClock
          ? `Edit ${initialClock.label}`
          : `Add ${shared ? "Shared " : ""}Clock`}
      </DialogTitleWithCloseButton>
      <DialogContent>
        <Stack spacing={2} sx={{ mt: 1 }}>
          {error && (
            <Alert severity={"error"}>
              <AlertTitle>Error</AlertTitle>
              {error}
            </Alert>
          )}
          <TextField
            label={"Title"}
            required
            value={title}
            onChange={(evt) => setTitle(evt.target.value)}
          />
          <TextField
            label={"Description"}
            value={description}
            onChange={(evt) => setDescription(evt.target.value)}
            multiline
            minRows={3}
          />
          <Typography>Segments</Typography>
          <Box display={"flex"} flexWrap={"wrap"}>
            {segmentOptions.map((segmentOption) => (
              <Card
                key={segmentOption}
                variant={"outlined"}
                sx={(theme) => ({
                  bgcolor:
                    segmentOption === segments
                      ? theme.palette.primary.light
                      : theme.palette.background.paperInlay,
                  mr: 1,
                  mb: 1,
                })}
              >
                <CardActionArea
                  onClick={() => setSegments(segmentOption)}
                  sx={{ p: 1 }}
                >
                  <Box display={"flex"} alignItems={"baseline"}>
                    <Typography variant={"h5"}>{segmentOption}</Typography>
                    <Typography variant={"subtitle1"} ml={1}>
                      segments
                    </Typography>
                  </Box>
                  <ClockCircle segments={segmentOption} value={0} />
                </CardActionArea>
              </Card>
            ))}
          </Box>
        </Stack>
      </DialogContent>
      <DialogActions>
        <Button
          disabled={loading}
          color={"inherit"}
          onClick={handleDialogClose}
        >
          Cancel
        </Button>
        <Button disabled={loading} variant={"contained"} onClick={handleSubmit}>
          {initialClock
            ? `Save Changes`
            : `Add ${shared ? "Shared " : ""}Clock`}
        </Button>
      </DialogActions>
    </Dialog>
  );
}
