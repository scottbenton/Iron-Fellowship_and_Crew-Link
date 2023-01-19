import { Grid } from "@mui/material";
import {
  healthTrack,
  momentumTrack,
  spiritTrack,
  supplyTrack,
} from "../../../data/defaultTracks";
import { useSnackbar } from "../../../hooks/useSnackbar";
import { Track } from "./Track";
import { TRACK_KEYS, useCharacterSheetStore } from "../characterSheet.store";

export function TracksSection() {
  const { error } = useSnackbar();

  const updateCharacterTrack = useCharacterSheetStore(
    (store) => store.updateCharacterTrack
  );
  const momentum = useCharacterSheetStore(
    (store) => store.character?.momentum
  ) as number;
  const health = useCharacterSheetStore(
    (store) => store.character?.health
  ) as number;
  const spirit = useCharacterSheetStore(
    (store) => store.character?.spirit
  ) as number;
  const supply = useCharacterSheetStore((store) => store.supply) as number;

  const updateTrackValue = (track: TRACK_KEYS, newValue: number) =>
    new Promise<boolean>((resolve, reject) => {
      updateCharacterTrack(track, newValue)
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
      <Grid item xs={4}>
        <Track
          label={"Health"}
          value={health}
          onChange={(newValue) => updateTrackValue("health", newValue)}
          min={healthTrack.min}
          max={healthTrack.max}
        />
      </Grid>
      <Grid item xs={4}>
        <Track
          label={"Spirit"}
          value={spirit}
          onChange={(newValue) => updateTrackValue("spirit", newValue)}
          min={spiritTrack.min}
          max={spiritTrack.max}
        />
      </Grid>
      <Grid item xs={4}>
        <Track
          label={"Supply"}
          value={supply}
          onChange={(newValue) => updateTrackValue("supply", newValue)}
          min={supplyTrack.min}
          max={supplyTrack.max}
        />
      </Grid>
      <Grid item xs={12}>
        <Track
          label={"Momentum"}
          value={momentum}
          onChange={(newValue) => updateTrackValue("momentum", newValue)}
          min={momentumTrack.min}
          max={momentumTrack.max}
        />
      </Grid>
    </Grid>
  );
}
