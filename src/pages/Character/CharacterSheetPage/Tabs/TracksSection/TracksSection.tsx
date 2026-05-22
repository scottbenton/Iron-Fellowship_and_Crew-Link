import { Stack } from "@mui/material";
import { ProgressTrackSection } from "../ProgressTrackSection";
import { TrackTypes } from "types/Track.type";
import { GAME_SYSTEMS } from "types/GameSystems.type";
import { ClockSection } from "components/features/charactersAndCampaigns/Clocks/ClockSection";
import { useGameSystem } from "hooks/useGameSystem";
import { SpecialTracks } from "./SpecialTracks";
import { useStore } from "stores/store";

export function TracksSection() {
  const isStarforged = useGameSystem().gameSystem === GAME_SYSTEMS.STARFORGED;
  const isIronsworn = useGameSystem().gameSystem === GAME_SYSTEMS.IRONSWORN;
  const isDelveEnabled = useStore((store) =>
    store.rules.expansionIds.includes("delve")
  );

  return (
    <Stack spacing={2} sx={{ pb: 2 }}>
      <SpecialTracks />
      <ProgressTrackSection type={TrackTypes.Fray} typeLabel={"Combat Track"} />
      <ProgressTrackSection
        type={TrackTypes.Vow}
        typeLabel={"Vow"}
        showPersonalIfInCampaign
      />
      <ProgressTrackSection
        type={TrackTypes.Journey}
        typeLabel={isStarforged ? "Expedition" : "Journey"}
      />
      {isIronsworn && isDelveEnabled && (
        <ProgressTrackSection
          type={TrackTypes.DelveSite}
          typeLabel={"Delve Site"}
        />
      )}
      {isStarforged && (
        <ProgressTrackSection
          type={TrackTypes.SceneChallenge}
          typeLabel={"Scene Challenge"}
        />
      )}
      <ClockSection />
    </Stack>
  );
}
