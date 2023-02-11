import { Box, ButtonBase, Grid, Typography } from "@mui/material";
import {
  healthTrack,
  momentumTrack,
  spiritTrack,
  supplyTrack,
} from "../../../data/defaultTracks";
import { useSnackbar } from "../../../hooks/useSnackbar";
import { Track } from "./Track";
import { TRACK_KEYS, useCharacterSheetStore } from "../characterSheet.store";
import ResetIcon from "@mui/icons-material/Replay";
import { useUpdateCharacterSheetTrack } from "api/shared/updateCharacterSheetTrack";

export function TracksSection() {
  const { error } = useSnackbar();

  const { updateTrack } = useUpdateCharacterSheetTrack();

  const momentum = useCharacterSheetStore(
    (store) => store.character?.momentum
  ) as number;
  const maxMomentum = useCharacterSheetStore((store) => store.maxMomentum);
  const momentumResetValue = useCharacterSheetStore(
    (store) => store.momentumResetValue
  );
  const health = useCharacterSheetStore(
    (store) => store.character?.health
  ) as number;
  const spirit = useCharacterSheetStore(
    (store) => store.character?.spirit
  ) as number;
  const supply = useCharacterSheetStore((store) => store.supply) as number;

  const updateTrackValue = (track: TRACK_KEYS, newValue: number) =>
    new Promise<boolean>((resolve, reject) => {
      updateTrack({ trackKey: track, value: newValue })
        .then(() => {
          resolve(true);
        })
        .catch((e) => {
          error("Error: Failed to update your " + track);
          reject(e);
        });
    });

  return (
    <Grid container spacing={2}>
      <Grid item xs={12} md={4}>
        <Track
          label={"Health"}
          value={health}
          onChange={(newValue) => updateTrackValue("health", newValue)}
          min={healthTrack.min}
          max={healthTrack.max}
        />
      </Grid>
      <Grid item xs={12} md={4}>
        <Track
          label={"Spirit"}
          value={spirit}
          onChange={(newValue) => updateTrackValue("spirit", newValue)}
          min={spiritTrack.min}
          max={spiritTrack.max}
        />
      </Grid>
      <Grid item xs={12} md={4}>
        <Track
          label={"Supply"}
          value={supply}
          onChange={(newValue) => updateTrackValue("supply", newValue)}
          min={supplyTrack.min}
          max={supplyTrack.max}
        />
      </Grid>
      <Grid item xs={12}>
        <Box display={"flex"}>
          <Track
            label={"Momentum"}
            value={momentum}
            onChange={(newValue) => updateTrackValue("momentum", newValue)}
            min={momentumTrack.min}
            max={maxMomentum ?? momentumTrack.max}
            sx={{ flexGrow: 1 }}
          />
          <ButtonBase
            sx={(theme) => ({
              backgroundColor: theme.palette.primary.light,
              color: theme.palette.primary.contrastText,
              borderRadius: theme.shape.borderRadius,
              ml: 0.25,

              "&:hover": {
                backgroundColor: theme.palette.primary.main,
              },
            })}
            onClick={() =>
              updateTrackValue(
                "momentum",
                momentumResetValue ?? momentumTrack.startingValue
              )
            }
          >
            <ResetIcon />
          </ButtonBase>
        </Box>
      </Grid>
    </Grid>
  );
}
