import { Stack } from "@mui/material";
import { ProgressTrackSection } from "../ProgressTrackSection";
import { TRACK_TYPES } from "types/Track.type";
import { GAME_SYSTEMS, GameSystemChooser } from "types/GameSystems.type";
import { IronswornTracks } from "./IronswornTracks";
import { LegacyTracks } from "./LegacyTracks";
import { useGameSystemValue } from "hooks/useGameSystemValue";

const systemTracks: GameSystemChooser<() => JSX.Element> = {
  [GAME_SYSTEMS.IRONSWORN]: IronswornTracks,
  [GAME_SYSTEMS.STARFORGED]: LegacyTracks,
};

export function TracksSection() {
  const Tracks = useGameSystemValue(systemTracks);

  return (
    <Stack spacing={2}>
      <Tracks />
      <ProgressTrackSection
        type={TRACK_TYPES.FRAY}
        typeLabel={"Combat Track"}
      />
      <ProgressTrackSection
        type={TRACK_TYPES.VOW}
        typeLabel={"Vow"}
        showPersonalIfInCampaign
      />
      <ProgressTrackSection type={TRACK_TYPES.JOURNEY} typeLabel={"Journey"} />
    </Stack>
  );
}
