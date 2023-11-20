import { Stack } from "@mui/material";
import { SectionHeading } from "components/shared/SectionHeading";
import { supplyTrack } from "data/defaultTracks";
import { Track } from "components/features/Track";
import { TRACK_STATUS, TRACK_TYPES } from "types/Track.type";
import { ProgressTrackList } from "components/features/ProgressTrack";
import { useStore } from "stores/store";
import { ClockSection } from "components/features/charactersAndCampaigns/Clocks/ClockSection";
import { useGameSystem } from "hooks/useGameSystem";
import { GAME_SYSTEMS } from "types/GameSystems.type";

export interface TracksSectionProps {
  supply: number;
}
export function TracksSection(props: TracksSectionProps) {
  const { supply } = props;

  const isStarforged = useGameSystem().gameSystem === GAME_SYSTEMS.STARFORGED;

  const updateCampaignSupply = useStore(
    (store) => store.campaigns.currentCampaign.updateCampaignSupply
  );

  const tracks = useStore(
    (store) => store.campaigns.currentCampaign.tracks.trackMap
  );

  const characterTracks = useStore(
    (store) => store.campaigns.currentCampaign.characters.characterTracks
  );
  const characters = useStore(
    (store) => store.campaigns.currentCampaign.characters.characterMap
  );

  const vows = tracks[TRACK_TYPES.VOW];
  const journeys = tracks[TRACK_TYPES.JOURNEY];
  const frays = tracks[TRACK_TYPES.FRAY];

  const addCampaignProgressTrack = useStore(
    (store) => store.campaigns.currentCampaign.tracks.addTrack
  );
  const updateCampaignProgressTrack = useStore(
    (store) => store.campaigns.currentCampaign.tracks.updateTrack
  );
  const updateCharacterProgressTrack = useStore(
    (store) => store.campaigns.currentCampaign.tracks.updateCharacterTrack
  );

  return (
    <Stack spacing={2} sx={{ pb: 2 }}>
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
        onChange={(newValue) => updateCampaignSupply(newValue).catch(() => {})}
      />
      <div>
        <ProgressTrackList
          tracks={frays}
          trackType={TRACK_TYPES.FRAY}
          typeLabel={"Shared Combat Track"}
          handleAdd={(newTrack) => addCampaignProgressTrack(newTrack)}
          handleUpdateValue={(trackId, value) =>
            updateCampaignProgressTrack(trackId, { value })
          }
          handleUpdateTrack={(trackId, track) =>
            updateCampaignProgressTrack(trackId, track)
          }
          handleDeleteTrack={(trackId) =>
            updateCampaignProgressTrack(trackId, {
              status: TRACK_STATUS.COMPLETED,
            })
          }
        />
        <ProgressTrackList
          tracks={vows}
          trackType={TRACK_TYPES.VOW}
          typeLabel={"Shared Vow"}
          handleAdd={(newTrack) => addCampaignProgressTrack(newTrack)}
          handleUpdateValue={(trackId, value) =>
            updateCampaignProgressTrack(trackId, { value })
          }
          handleUpdateTrack={(trackId, track) =>
            updateCampaignProgressTrack(trackId, track)
          }
          handleDeleteTrack={(trackId) =>
            updateCampaignProgressTrack(trackId, {
              status: TRACK_STATUS.COMPLETED,
            })
          }
        />
        <ProgressTrackList
          tracks={journeys}
          trackType={TRACK_TYPES.JOURNEY}
          typeLabel={isStarforged ? "Shared Expedition" : "Shared Journey"}
          handleAdd={(newTrack) => addCampaignProgressTrack(newTrack)}
          handleUpdateValue={(trackId, value) =>
            updateCampaignProgressTrack(trackId, { value })
          }
          handleUpdateTrack={(trackId, track) =>
            updateCampaignProgressTrack(trackId, track)
          }
          handleDeleteTrack={(trackId) =>
            updateCampaignProgressTrack(trackId, {
              status: TRACK_STATUS.COMPLETED,
            })
          }
        />
        {Object.keys(characterTracks).map((characterId) => (
          <div key={characterId}>
            {characters[characterId] &&
              Object.keys(characterTracks[characterId]?.[TRACK_TYPES.VOW] ?? {})
                .length > 0 && (
                <ProgressTrackList
                  tracks={characterTracks[characterId][TRACK_TYPES.VOW]}
                  trackType={TRACK_TYPES.VOW}
                  typeLabel={characters[characterId].name + "'s Vow"}
                  handleUpdateValue={(trackId, value) =>
                    updateCharacterProgressTrack(characterId, trackId, {
                      value,
                    })
                  }
                  handleUpdateTrack={(trackId, track) =>
                    updateCharacterProgressTrack(characterId, trackId, track)
                  }
                />
              )}
          </div>
        ))}
      </div>
      {isStarforged && <ClockSection />}
    </Stack>
  );
}
