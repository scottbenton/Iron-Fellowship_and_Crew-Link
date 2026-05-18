import { Container, Grid, Stack } from "@mui/material";
import { SectionHeading } from "components/shared/SectionHeading";
import { Track } from "components/features/Track";
import { TrackStatus, TrackTypes } from "types/Track.type";
import {
  ProgressTrack,
  ProgressTrackList,
} from "components/features/ProgressTrack";
import { useStore } from "stores/store";
import { ClockSection } from "components/features/charactersAndCampaigns/Clocks/ClockSection";
import { useGameSystem } from "hooks/useGameSystem";
import { GAME_SYSTEMS } from "types/GameSystems.type";

export function TracksTab() {
  const isStarforged = useGameSystem().gameSystem === GAME_SYSTEMS.STARFORGED;
  const isIronsworn = useGameSystem().gameSystem === GAME_SYSTEMS.IRONSWORN;
  const showDelve = useStore((store) => store.settings.delve.showDelveMoves);

  const conditionMeterRules = useStore((store) => store.rules.conditionMeters);
  const conditionMeterValues = useStore(
    (store) => store.campaigns.currentCampaign.currentCampaign?.conditionMeters
  );
  const updateCampaignConditionMeter = useStore(
    (store) => store.campaigns.currentCampaign.updateCampaignConditionMeter
  );

  const characterTracks = useStore(
    (store) => store.campaigns.currentCampaign.characters.characterTracks
  );
  const characters = useStore(
    (store) => store.campaigns.currentCampaign.characters.characterMap
  );

  const updateCharacterProgressTrack = useStore(
    (store) => store.campaigns.currentCampaign.tracks.updateCharacterTrack
  );

  return (
    <Stack spacing={2} sx={{ pb: 2 }}>
      <SectionHeading label={"Shared Condition Meters"} />
      <Container maxWidth={false}>
        <Grid container spacing={2}>
          {Object.keys(conditionMeterRules)
            .filter((cm) => conditionMeterRules[cm].shared)
            .map((cm) => (
              <Grid key={cm} item xs={12} sm={6} lg={4}>
                <Track
                  min={conditionMeterRules[cm].min}
                  max={conditionMeterRules[cm].max}
                  value={
                    conditionMeterValues?.[cm] ?? conditionMeterRules[cm].value
                  }
                  label={conditionMeterRules[cm].label}
                  onChange={(newValue) =>
                    updateCampaignConditionMeter(cm, newValue).catch(() => {})
                  }
                />
              </Grid>
            ))}
        </Grid>
      </Container>

      <div>
        <ProgressTrackList
          trackType={TrackTypes.Fray}
          typeLabel={"Shared Combat Track"}
          isCampaign
        />
        <ProgressTrackList
          trackType={TrackTypes.Vow}
          typeLabel={"Shared Vow"}
          isCampaign
        />
        <ProgressTrackList
          trackType={TrackTypes.Journey}
          typeLabel={isStarforged ? "Shared Expedition" : "Shared Journey"}
          isCampaign
        />
        {isIronsworn && showDelve && (
          <ProgressTrackList
            trackType={TrackTypes.DelveSite}
            typeLabel={"Shared Delve Site"}
            isCampaign
          />
        )}
        {isStarforged && (
          <ProgressTrackList
            trackType={TrackTypes.SceneChallenge}
            typeLabel={"Shared Scene Challenge"}
            isCampaign
          />
        )}
        {Object.keys(characterTracks).map((characterId) => (
          <div key={characterId}>
            {characters[characterId] &&
              Object.keys(characterTracks[characterId]?.[TrackTypes.Vow] ?? {})
                .length > 0 && (
                <>
                  <SectionHeading
                    label={characters[characterId].name + "'s Vows"}
                  />
                  <Stack mt={2} spacing={4} mb={4} px={{ xs: 2, sm: 3 }}>
                    {Object.keys(
                      characterTracks[characterId]?.[TrackTypes.Vow] ?? {}
                    ).map((trackId, index) => {
                      const track =
                        characterTracks[characterId][TrackTypes.Vow][trackId];
                      return (
                        <ProgressTrack
                          key={index}
                          status={track.status}
                          trackType={TrackTypes.Vow}
                          label={track.label}
                          description={track.description}
                          difficulty={track.difficulty}
                          value={track.value}
                          max={40}
                          onValueChange={(value) =>
                            updateCharacterProgressTrack(characterId, trackId, {
                              value,
                            })
                          }
                          onComplete={() =>
                            updateCharacterProgressTrack(characterId, trackId, {
                              status: TrackStatus.Completed,
                            })
                          }
                        />
                      );
                    })}
                  </Stack>
                </>
              )}
          </div>
        ))}
      </div>
      <ClockSection />
    </Stack>
  );
}
