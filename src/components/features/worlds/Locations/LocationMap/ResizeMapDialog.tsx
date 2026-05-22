import {
  Alert,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  List,
  ListItem,
  ListItemText,
  Stack,
  Typography,
} from "@mui/material";
import { UpdateData } from "firebase/firestore";
import { DialogTitleWithCloseButton } from "components/shared/DialogTitleWithCloseButton";
import { NumberField } from "components/shared/NumberField";
import { useEffect, useMemo, useState } from "react";
import { useStore } from "stores/store";
import {
  MapBackgroundImageFit,
  MapEntry,
  MapEntryType,
  Location,
} from "types/Locations.type";
import { useImageDimensions } from "./useImageDimensions";
import {
  DEFAULT_MAP_HEX_SIZE,
  MAX_MAP_DIMENSION_INPUT,
  MAX_MAP_HEX_SIZE,
  MIN_MAP_COLS,
  MIN_MAP_HEX_SIZE,
  MIN_MAP_ROWS,
  getMapLayout,
  isCellOutOfBounds,
} from "./mapDimensions";

export interface ResizeMapDialogProps {
  locationId: string;
  open: boolean;
  onClose: () => void;
}

interface ResizePlan {
  updates: UpdateData<Location>;
  affectedLocationNames: string[];
}

type ResizeUpdates = UpdateData<Location> & Record<string, number | null>;

export function ResizeMapDialog(props: ResizeMapDialogProps) {
  const { locationId, open, onClose } = props;

  const [rows, setRows] = useState(MIN_MAP_ROWS);
  const [cols, setCols] = useState(MIN_MAP_COLS);
  const [hexSize, setHexSize] = useState(DEFAULT_MAP_HEX_SIZE);
  const [pendingResizePlan, setPendingResizePlan] = useState<ResizePlan>();
  const [isSaving, setIsSaving] = useState(false);

  const locations = useStore(
    (store) => store.worlds.currentWorld.currentWorldLocations.locationMap
  );
  const updateLocation = useStore(
    (store) => store.worlds.currentWorld.currentWorldLocations.updateLocation
  );
  const location = locations[locationId];

  const backgroundImageDimensions = useImageDimensions(
    location?.mapBackgroundImageUrl &&
      location?.mapBackgroundImageFit === MapBackgroundImageFit.Contain
      ? location.mapBackgroundImageUrl
      : undefined
  );

  const currentLayout = useMemo(
    () =>
      getMapLayout({
        imageDimensions: backgroundImageDimensions,
        mapRows: location?.mapRows,
        mapCols: location?.mapCols,
        hexSize: location?.mapHexSize,
      }),
    [
      backgroundImageDimensions,
      location?.mapCols,
      location?.mapHexSize,
      location?.mapRows,
    ]
  );

  useEffect(() => {
    if (!open) {
      return;
    }

    setRows(currentLayout.rows);
    setCols(currentLayout.cols);
    setHexSize(location?.mapHexSize ?? DEFAULT_MAP_HEX_SIZE);
    setPendingResizePlan(undefined);
    setIsSaving(false);
  }, [currentLayout.cols, currentLayout.rows, location?.mapHexSize, open]);

  const previewLayout = useMemo(
    () =>
      getMapLayout({
        imageDimensions: null,
        mapRows: rows,
        mapCols: cols,
        hexSize,
      }),
    [cols, hexSize, rows]
  );

  const validateValue = (
    value: number | undefined,
    min: number,
    max: number
  ) => {
    if (typeof value !== "number") {
      return min;
    }

    return Math.min(Math.max(value, min), max);
  };

  const buildResizePlan = () => {
    const nextRows = validateValue(rows, MIN_MAP_ROWS, MAX_MAP_DIMENSION_INPUT);
    const nextCols = validateValue(cols, MIN_MAP_COLS, MAX_MAP_DIMENSION_INPUT);
    const nextHexSize = validateValue(
      hexSize,
      MIN_MAP_HEX_SIZE,
      MAX_MAP_HEX_SIZE
    );
    const updates: ResizeUpdates = {
      mapRows: nextRows,
      mapCols: nextCols,
      mapHexSize: nextHexSize,
    };
    const affectedLocationNames = new Map<string, string>();

    Object.entries(location?.map ?? {}).forEach(([rowKey, columnMap]) => {
      const row = Number(rowKey);
      Object.entries(
        (columnMap ?? {}) as Record<string, MapEntry | null>
      ).forEach(([colKey, entry]) => {
        const col = Number(colKey);
        if (!entry || !isCellOutOfBounds(row, col, nextRows, nextCols)) {
          return;
        }

        updates[`map.${row}.${col}`] = null;

        if (entry.type === MapEntryType.Location) {
          entry.locationIds.forEach((affectedLocationId) => {
            affectedLocationNames.set(
              affectedLocationId,
              locations[affectedLocationId]?.name ?? "Unknown Location"
            );
          });
        }
      });
    });

    return {
      updates,
      affectedLocationNames: Array.from(affectedLocationNames.values()),
    };
  };

  const handleApply = async (plan: ResizePlan) => {
    setIsSaving(true);
    try {
      await updateLocation(locationId, plan.updates);
      setPendingResizePlan(undefined);
      onClose();
    } finally {
      setIsSaving(false);
    }
  };

  const handleSave = () => {
    const plan = buildResizePlan();

    if (plan.affectedLocationNames.length > 0) {
      setPendingResizePlan(plan);
      return;
    }

    handleApply(plan).catch(() => {});
  };

  return (
    <>
      <Dialog
        open={open && !pendingResizePlan}
        onClose={isSaving ? undefined : onClose}
        fullWidth
        maxWidth={"xs"}
      >
        <DialogTitleWithCloseButton onClose={onClose}>
          Resize Map
        </DialogTitleWithCloseButton>
        <DialogContent>
          <Stack spacing={2} sx={{ pt: 1 }}>
            <NumberField
              label={"Rows"}
              fullWidth
              value={rows}
              onChange={(value) =>
                setRows(validateValue(value, MIN_MAP_ROWS, MAX_MAP_DIMENSION_INPUT))
              }
              inputProps={{ min: MIN_MAP_ROWS, max: MAX_MAP_DIMENSION_INPUT }}
              helperText={`Minimum ${MIN_MAP_ROWS}, suggested maximum ${MAX_MAP_DIMENSION_INPUT}`}
            />
            <NumberField
              label={"Columns"}
              fullWidth
              value={cols}
              onChange={(value) =>
                setCols(validateValue(value, MIN_MAP_COLS, MAX_MAP_DIMENSION_INPUT))
              }
              inputProps={{ min: MIN_MAP_COLS, max: MAX_MAP_DIMENSION_INPUT }}
              helperText={`Minimum ${MIN_MAP_COLS}, suggested maximum ${MAX_MAP_DIMENSION_INPUT}`}
            />
            <NumberField
              label={"Hex Size"}
              fullWidth
              value={hexSize}
              onChange={(value) =>
                setHexSize(validateValue(value, MIN_MAP_HEX_SIZE, MAX_MAP_HEX_SIZE))
              }
              inputProps={{ min: MIN_MAP_HEX_SIZE, max: MAX_MAP_HEX_SIZE }}
              helperText={`Visual size only. Range ${MIN_MAP_HEX_SIZE}-${MAX_MAP_HEX_SIZE}`}
            />
            <Alert severity={"info"}>
              <Typography variant={"body2"}>
                Preview size: {Math.round(previewLayout.width)}px by{" "}
                {Math.round(previewLayout.height)}px. Odd rows render with one
                fewer column.
              </Typography>
            </Alert>
          </Stack>
        </DialogContent>
        <DialogActions>
          <Button onClick={onClose} disabled={isSaving}>
            Cancel
          </Button>
          <Button onClick={handleSave} variant={"contained"} disabled={isSaving}>
            Apply
          </Button>
        </DialogActions>
      </Dialog>

      <Dialog
        open={!!pendingResizePlan}
        onClose={
          isSaving ? undefined : () => setPendingResizePlan(undefined)
        }
        fullWidth
        maxWidth={"sm"}
      >
        <DialogTitleWithCloseButton
          onClose={() => setPendingResizePlan(undefined)}
        >
          Confirm Map Resize
        </DialogTitleWithCloseButton>
        <DialogContent>
          <Stack spacing={2} sx={{ pt: 1 }}>
            <Typography>
              {pendingResizePlan?.affectedLocationNames.length ?? 0} locations
              will be removed from the map and become unplaced sub-locations.
              They will not be deleted.
            </Typography>
            <List dense disablePadding>
              {pendingResizePlan?.affectedLocationNames.map((name) => (
                <ListItem key={name} disableGutters>
                  <ListItemText primary={name} />
                </ListItem>
              ))}
            </List>
            <Typography variant={"body2"} color={"text.secondary"}>
              Path cells outside the new bounds will be cleared automatically.
            </Typography>
          </Stack>
        </DialogContent>
        <DialogActions>
          <Button
            onClick={() => setPendingResizePlan(undefined)}
            disabled={isSaving}
          >
            Back
          </Button>
          <Button
            color={"warning"}
            variant={"contained"}
            disabled={isSaving || !pendingResizePlan}
            onClick={() => {
              if (pendingResizePlan) {
                handleApply(pendingResizePlan).catch(() => {});
              }
            }}
          >
            Resize Map
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
}
