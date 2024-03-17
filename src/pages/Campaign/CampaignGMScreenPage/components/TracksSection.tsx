import { Grid, Stack } from "@mui/material";
import { SectionHeading } from "components/shared/SectionHeading";
import { supplyTrack } from "data/defaultTracks";
import { Track } from "components/features/Track";
import { TRACK_STATUS, TRACK_TYPES } from "types/Track.type";
import {
  ProgressTrack,
  ProgressTrackList,
} from "components/features/ProgressTrack";
import { useStore } from "stores/store";
import { ClockSection } from "components/features/charactersAndCampaigns/Clocks/ClockSection";
import { useGameSystem } from "hooks/useGameSystem";
import { GAME_SYSTEMS } from "types/GameSystems.type";
import { useNewCustomContentPage } from "hooks/featureFlags/useNewCustomContentPage";

export interface TracksSectionProps {
  supply: number;
}
export function TracksSection(props: TracksSectionProps) {
  const { supply } = props;

  const isStarforged = useGameSystem().gameSystem === GAME_SYSTEMS.STARFORGED;

  const updateCampaignSupply = useStore(
    (store) => store.campaigns.currentCampaign.updateCampaignSupply
  );

  const conditionMeterRules = useStore((store) => store.rules.conditionMeters);
  const conditionMeterValues = useStore(
    (store) => store.campaigns.currentCampaign.currentCampaign?.conditionMeters
  );
  const showNewConditionMeters = useNewCustomContentPage();
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
      {showNewConditionMeters ? (
        <>
          <SectionHeading label={"Shared Condition Meters"} />
          <Grid container spacing={2}>
            {Object.keys(conditionMeterRules)
              .filter((cm) => conditionMeterRules[cm].shared)
              .map((cm) => (
                <Grid key={cm} item xs={12} sm={6} md={4}>
                  <Track
                    min={conditionMeterRules[cm].min}
                    max={conditionMeterRules[cm].max}
                    value={
                      conditionMeterValues?.[cm] ??
                      conditionMeterRules[cm].value
                    }
                    label={conditionMeterRules[cm].label}
                    onChange={(newValue) =>
                      updateCampaignConditionMeter(cm, newValue).catch(() => {})
                    }
                  />
                </Grid>
              ))}
          </Grid>
        </>
      ) : (
        <>
          <SectionHeading label={"Supply"} />
          <Track
            sx={{
              mt: 4,
              mb: 4,
              maxWidth: 400,
              px: { xs: 2, sm: 3 },
            }}
            min={supplyTrack.min}
            max={supplyTrack.max}
            value={supply}
            onChange={(newValue) =>
              updateCampaignSupply(newValue).catch(() => {})
            }
          />
        </>
      )}
      <div>
        <ProgressTrackList
          trackType={TRACK_TYPES.FRAY}
          typeLabel={"Shared Combat Track"}
          isCampaign
        />
        <ProgressTrackList
          trackType={TRACK_TYPES.VOW}
          typeLabel={"Shared Vow"}
          isCampaign
        />
        <ProgressTrackList
          trackType={TRACK_TYPES.JOURNEY}
          typeLabel={isStarforged ? "Shared Expedition" : "Shared Journey"}
          isCampaign
        />
        {Object.keys(characterTracks).map((characterId) => (
          <div key={characterId}>
            {characters[characterId] &&
              Object.keys(characterTracks[characterId]?.[TRACK_TYPES.VOW] ?? {})
                .length > 0 && (
                <>
                  <SectionHeading
                    label={characters[characterId].name + "'s Vows"}
                  />
                  <Stack mt={2} spacing={4} mb={4} px={{ xs: 2, sm: 3 }}>
                    {Object.keys(
                      characterTracks[characterId]?.[TRACK_TYPES.VOW] ?? {}
                    ).map((trackId, index) => {
                      const track =
                        characterTracks[characterId][TRACK_TYPES.VOW][trackId];
                      return (
                        <ProgressTrack
                          key={index}
                          status={track.status}
                          trackType={TRACK_TYPES.VOW}
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
                          onDelete={() =>
                            updateCharacterProgressTrack(characterId, trackId, {
                              status: TRACK_STATUS.COMPLETED,
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
      {isStarforged && <ClockSection />}
    </Stack>
  );
}
