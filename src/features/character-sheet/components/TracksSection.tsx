import { Box, Card, Rating, Stack, Typography } from "@mui/material";
import {
  healthTrack,
  momentumTrack,
  spiritTrack,
  supplyTrack,
} from "../../../data/defaultTracks";
import { useSnackbar } from "../../../hooks/useSnackbar";
import { TrackKeys, updateCharacterTrack } from "../api/updateCharacterTrack";
import { StatComponent } from "./StatComponent";
import HealthFilledIcon from "@mui/icons-material/Favorite";
import HealthOutlinedIcon from "@mui/icons-material/FavoriteBorder";
import SpiritFilledIcon from "@mui/icons-material/LocalFireDepartment";
import SpiritOutlinedIcon from "@mui/icons-material/LocalFireDepartmentOutlined";
import { Track } from "./Track";

export interface TracksSectionProps {
  characterId: string;
  health: number;
  spirit: number;
  supply: number;
  momentum: number;
}

export function TracksSection(props: TracksSectionProps) {
  const { characterId, health, spirit, supply, momentum } = props;
  const { error } = useSnackbar();

  const updateTrackValue = (track: TrackKeys, newValue: number) =>
    new Promise<boolean>((resolve, reject) => {
      updateCharacterTrack(characterId, track, newValue)
        .then(() => {
          resolve(true);
        })
        .catch((e) => {
          console.error(e);
          error("Error: Failed to update your " + track);
          reject(e);
        });
    });

  return (
    <Stack spacing={2} alignItems={"flex-end"}>
      <Stack spacing={2} direction={"row"}>
        <Track
          label={"Health"}
          value={health}
          onChange={(newValue) => updateTrackValue("health", newValue)}
          min={healthTrack.min}
          max={healthTrack.max}
        />
        <Track
          label={"Spirit"}
          value={spirit}
          onChange={(newValue) => updateTrackValue("spirit", newValue)}
          min={spiritTrack.min}
          max={spiritTrack.max}
        />
        <Track
          label={"Supply"}
          value={supply}
          onChange={(newValue) => updateTrackValue("supply", newValue)}
          min={supplyTrack.min}
          max={supplyTrack.max}
        />
      </Stack>
      <Track
        label={"Momentum"}
        value={momentum}
        onChange={(newValue) => updateTrackValue("momentum", newValue)}
        min={momentumTrack.min}
        max={momentumTrack.max}
      />
    </Stack>
  );
}
