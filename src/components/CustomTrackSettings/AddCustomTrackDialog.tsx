import {
  Button,
  Checkbox,
  Dialog,
  DialogActions,
  DialogContent,
  FormControlLabel,
  IconButton,
  MenuItem,
  Paper,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableFooter,
  TableHead,
  TableRow,
  TextField,
} from "@mui/material";
import { DialogTitleWithCloseButton } from "components/DialogTitleWithCloseButton";
import { useEffect, useMemo, useState } from "react";
import {
  CUSTOM_TRACK_SIZE,
  CustomTrack as ICustomTrack,
  TrackValue,
} from "types/CustomTrackSettings.type";
import DeleteIcon from "@mui/icons-material/Delete";
import { CustomTrackPreview } from "./CustomTrackPreview";

export interface AddCustomTrackDialogProps {
  open: boolean;
  onClose: () => void;
  initialTrack?: ICustomTrack;
  addCustomTrack: (track: ICustomTrack) => Promise<void>;
}

export function AddCustomTrackDialog(props: AddCustomTrackDialogProps) {
  const { open, onClose, addCustomTrack, initialTrack } = props;
  const [isLoading, setIsLoading] = useState(false);

  const [trackName, setTrackName] = useState<string>(initialTrack?.label ?? "");
  const [cells, setCells] = useState<TrackValue<string | number>[]>(
    initialTrack?.values ?? [
      {
        value: "",
        selectable: true,
      },
    ]
  );
  const [showRoller, setShowRoller] = useState<boolean>(
    initialTrack?.rollable ?? false
  );
  const [trackSize, setTrackSize] = useState<CUSTOM_TRACK_SIZE>(
    initialTrack?.size ?? CUSTOM_TRACK_SIZE.SMALL
  );

  const isNumericTrack = useMemo(() => {
    console.debug(
      cells.filter((cell) => cell.selectable === true && !isNumeric(cell.value))
    );
    return (
      cells.filter((cell) => cell.selectable === true && !isNumeric(cell.value))
        .length === 0
    );
  }, [cells]);
  console.debug(isNumericTrack);

  const resetAndClose = () => {
    onClose();
    setIsLoading(false);
    setTrackName("");
    setCells([
      {
        value: "",
        selectable: true,
      },
    ]);
    setShowRoller(false);
    setTrackSize(CUSTOM_TRACK_SIZE.SMALL);
  };

  const track: ICustomTrack = useMemo(() => {
    const t: ICustomTrack = {
      label: trackName,
      values: isNumericTrack
        ? cells.map((cell) => ({
            value:
              cell.selectable && typeof cell.value === "string"
                ? parseInt(cell.value)
                : cell.value,
            selectable: cell.selectable,
          }))
        : cells,
      size: trackSize,
      order: 0,
      rollable: showRoller,
    };
    return t;
  }, [trackName, cells, showRoller, isNumericTrack, trackSize]);

  useEffect(() => {
    if (!isNumericTrack) {
      setShowRoller(false);
    }
  }, [isNumericTrack]);

  const handleSubmit = () => {
    setIsLoading(true);
    if (track.label) {
      addCustomTrack(track)
        .then(() => {
          resetAndClose();
        })
        .catch(() => {
          setIsLoading(false);
        });
    }
  };

  return (
    <Dialog open={open} onClose={resetAndClose}>
      <DialogTitleWithCloseButton onClose={resetAndClose}>
        Add Custom Track
      </DialogTitleWithCloseButton>
      <DialogContent>
        <Stack spacing={3} direction={"column"} sx={{ mt: 1 }}>
          <TextField
            label={"Custom Track Name"}
            value={trackName}
            onChange={(evt) => setTrackName(evt.target.value)}
          />
          <TableContainer component={Paper} variant={"outlined"}>
            <Table size={"small"}>
              <TableHead>
                <TableRow>
                  <TableCell>Cell Name</TableCell>
                  <TableCell>Read Only</TableCell>
                  <TableCell />
                </TableRow>
              </TableHead>
              <TableBody>
                {cells.map((cell, index) => (
                  <TableRow key={index}>
                    <TableCell>
                      <TextField
                        value={cell.value}
                        onChange={(evt) => {
                          setCells((prevCells) => {
                            let newCells = [...prevCells];
                            let newCell = {
                              ...newCells[index],
                              value: evt.target.value,
                            };
                            newCells[index] = newCell;
                            return newCells;
                          });
                        }}
                        variant={"standard"}
                        placeholder={"Ability Name"}
                      />
                    </TableCell>

                    <TableCell>
                      <Checkbox
                        checked={!cell.selectable}
                        onChange={(evt, checked) => {
                          setCells((prevCells) => {
                            let newCells = [...prevCells];
                            let newCell = {
                              ...newCells[index],
                              selectable: !checked,
                            };
                            newCells[index] = newCell;
                            return newCells;
                          });
                        }}
                      />
                    </TableCell>
                    <TableCell sx={{ width: 0, minWidth: "fit-content" }}>
                      <IconButton
                        onClick={() => {
                          setCells((prevCells) => {
                            let newCells = [...prevCells];
                            newCells.splice(index, 1);
                            return newCells;
                          });
                        }}
                      >
                        <DeleteIcon />
                      </IconButton>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>

              <TableFooter>
                <TableRow>
                  <TableCell>
                    <Button
                      color={"inherit"}
                      onClick={() => {
                        setCells((prevCells) => {
                          const newCells = [...prevCells];
                          newCells.push({
                            value: "",
                            selectable: true,
                          });
                          return newCells;
                        });
                      }}
                    >
                      Add Row
                    </Button>
                  </TableCell>
                </TableRow>
              </TableFooter>
            </Table>
          </TableContainer>
          <FormControlLabel
            disabled={!isNumericTrack}
            control={
              <Checkbox
                checked={showRoller}
                onChange={(evt, value) => setShowRoller(value)}
              />
            }
            label={
              "Add a Stat Roller for this track? (All non read-only inputs must be numeric)"
            }
          />
          <TextField
            select
            label={"Size"}
            value={trackSize}
            onChange={(evt) =>
              setTrackSize(evt.target.value as CUSTOM_TRACK_SIZE)
            }
            helperText={"Controls track width on larger screens"}
          >
            <MenuItem value={CUSTOM_TRACK_SIZE.SMALL}>Small</MenuItem>
            <MenuItem value={CUSTOM_TRACK_SIZE.MEDIUM}>Medium</MenuItem>
            <MenuItem value={CUSTOM_TRACK_SIZE.LARGE}>Large</MenuItem>
          </TextField>
          <CustomTrackPreview customTrack={track} />
        </Stack>
      </DialogContent>
      <DialogActions>
        <Button
          disabled={isLoading}
          color={"inherit"}
          onClick={() => resetAndClose()}
        >
          Cancel
        </Button>
        <Button
          disabled={isLoading}
          variant={"contained"}
          onClick={() => handleSubmit()}
        >
          Create Custom Track
        </Button>
      </DialogActions>
    </Dialog>
  );
}

function isNumeric(str: any) {
  if (typeof str === "number") return true;
  if (typeof str != "string") return false; // we only process strings!
  return (
    !isNaN(str as unknown as number) && // use type coercion to parse the _entirety_ of the string (`parseFloat` alone does not do this)...
    !isNaN(parseFloat(str))
  ); // ...and ensure strings of whitespace fail
}
