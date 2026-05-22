import {
  Alert,
  Button,
  DialogContentText,
  Dialog,
  DialogActions,
  DialogContent,
  List,
  ListItem,
  ListItemText,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import { UpdateData } from "firebase/firestore";
import { DialogTitleWithCloseButton } from "components/shared/DialogTitleWithCloseButton";
import { useEffect, useMemo, useState } from "react";
import { Controller, SubmitHandler, useForm } from "react-hook-form";
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

interface ResizeMapForm {
  rows: string;
  cols: string;
  hexSize: string;
}

function parseNumericInput(value: string) {
  if (!/^\d+$/.test(value.trim())) {
    return undefined;
  }

  return Number.parseInt(value, 10);
}

export function ResizeMapDialog(props: ResizeMapDialogProps) {
  const { locationId, open, onClose } = props;

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

  const {
    control,
    handleSubmit,
    reset,
    watch,
  } = useForm<ResizeMapForm>({
    mode: "onChange",
    defaultValues: {
      rows: `${currentLayout.rows}`,
      cols: `${currentLayout.cols}`,
      hexSize: `${location?.mapHexSize ?? DEFAULT_MAP_HEX_SIZE}`,
    },
  });

  useEffect(() => {
    if (!open) {
      return;
    }

    reset({
      rows: `${currentLayout.rows}`,
      cols: `${currentLayout.cols}`,
      hexSize: `${location?.mapHexSize ?? DEFAULT_MAP_HEX_SIZE}`,
    });
    setPendingResizePlan(undefined);
    setIsSaving(false);
  }, [currentLayout.cols, currentLayout.rows, location?.mapHexSize, open, reset]);

  const rowsValue = watch("rows");
  const colsValue = watch("cols");
  const hexSizeValue = watch("hexSize");

  const previewLayout = useMemo(
    () => {
      const parsedRows = parseNumericInput(rowsValue);
      const parsedCols = parseNumericInput(colsValue);
      const parsedHexSize = parseNumericInput(hexSizeValue);

      if (
        typeof parsedRows !== "number" ||
        typeof parsedCols !== "number" ||
        typeof parsedHexSize !== "number"
      ) {
        return undefined;
      }

      return getMapLayout({
        imageDimensions: null,
        mapRows: parsedRows,
        mapCols: parsedCols,
        hexSize: parsedHexSize,
      });
    },
    [colsValue, hexSizeValue, rowsValue]
  );

  const validateInput = (
    label: string,
    value: string,
    min: number,
    max: number
  ) => {
    if (!value.trim()) {
      return `${label} is required.`;
    }

    const parsedValue = parseNumericInput(value);
    if (typeof parsedValue !== "number") {
      return `${label} must be a whole number.`;
    }

    if (parsedValue < min || parsedValue > max) {
      return `${label} must be between ${min} and ${max}.`;
    }

    return true;
  };

  const buildResizePlan = (
    nextRows: number,
    nextCols: number,
    nextHexSize: number
  ) => {
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

  const handleSave: SubmitHandler<ResizeMapForm> = (values) => {
    const nextRows = Number.parseInt(values.rows, 10);
    const nextCols = Number.parseInt(values.cols, 10);
    const nextHexSize = Number.parseInt(values.hexSize, 10);
    const plan = buildResizePlan(nextRows, nextCols, nextHexSize);

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
        <form onSubmit={handleSubmit(handleSave)} noValidate>
          <DialogContent>
            <Stack spacing={2} sx={{ pt: 1 }}>
              <Controller
                name={"rows"}
                control={control}
                rules={{
                  validate: (value) =>
                    validateInput(
                      "Rows",
                      value,
                      MIN_MAP_ROWS,
                      MAX_MAP_DIMENSION_INPUT
                    ),
                }}
                render={({ field, fieldState }) => (
                  <TextField
                    {...field}
                    label={"Rows"}
                    fullWidth
                    error={!!fieldState.error}
                    helperText={
                      fieldState.error?.message ??
                      `Allowed range: ${MIN_MAP_ROWS}-${MAX_MAP_DIMENSION_INPUT}`
                    }
                    inputProps={{ inputMode: "numeric" }}
                  />
                )}
              />
              <Controller
                name={"cols"}
                control={control}
                rules={{
                  validate: (value) =>
                    validateInput(
                      "Columns",
                      value,
                      MIN_MAP_COLS,
                      MAX_MAP_DIMENSION_INPUT
                    ),
                }}
                render={({ field, fieldState }) => (
                  <TextField
                    {...field}
                    label={"Columns"}
                    fullWidth
                    error={!!fieldState.error}
                    helperText={
                      fieldState.error?.message ??
                      `Allowed range: ${MIN_MAP_COLS}-${MAX_MAP_DIMENSION_INPUT}`
                    }
                    inputProps={{ inputMode: "numeric" }}
                  />
                )}
              />
              <Controller
                name={"hexSize"}
                control={control}
                rules={{
                  validate: (value) =>
                    validateInput(
                      "Hex Size",
                      value,
                      MIN_MAP_HEX_SIZE,
                      MAX_MAP_HEX_SIZE
                    ),
                }}
                render={({ field, fieldState }) => (
                  <TextField
                    {...field}
                    label={"Hex Size"}
                    fullWidth
                    error={!!fieldState.error}
                    helperText={
                      fieldState.error?.message ??
                      `Visual size only. Allowed range: ${MIN_MAP_HEX_SIZE}-${MAX_MAP_HEX_SIZE}`
                    }
                    inputProps={{ inputMode: "numeric" }}
                  />
                )}
              />
              <Alert severity={"info"}>
                {previewLayout ? (
                  <Typography variant={"body2"}>
                    Preview size: {Math.round(previewLayout.width)}px by{" "}
                    {Math.round(previewLayout.height)}px. Odd rows render with one
                    fewer column.
                  </Typography>
                ) : (
                  <DialogContentText>
                    Enter whole numbers to preview the rendered map size.
                  </DialogContentText>
                )}
              </Alert>
            </Stack>
          </DialogContent>
          <DialogActions>
            <Button onClick={onClose} disabled={isSaving}>
              Cancel
            </Button>
            <Button type={"submit"} variant={"contained"} disabled={isSaving}>
              Apply
            </Button>
          </DialogActions>
        </form>
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
