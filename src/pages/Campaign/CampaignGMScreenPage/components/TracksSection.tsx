import { Stack } from "@mui/material";
import { SectionHeading } from "components/SectionHeading";
import { supplyTrack } from "data/defaultTracks";
import { Track } from "components/Track";
import { TRACK_TYPES } from "types/Track.type";
import { ProgressTrackList } from "components/ProgressTrack";
import { useStore } from "stores/store";

export interface TracksSectionProps {
  campaignId: string;
  supply: number;
}
export function TracksSection(props: TracksSectionProps) {
  const { campaignId, supply } = props;

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
  const updateCampaignProgressTrackValue = useStore(
    (store) => store.campaigns.currentCampaign.tracks.updateTrackValue
  );
  const updateCampaignProgressTrack = useStore(
    (store) => store.campaigns.currentCampaign.tracks.updateTrack
  );
  const removeCampaignProgressTrack = useStore(
    (store) => store.campaigns.currentCampaign.tracks.removeTrack
  );
  const updateCharacterProgressTrackValue = useStore(
    (store) => store.campaigns.currentCampaign.tracks.updateCharacterTrackValue
  );
  const updateCharacterProgressTrack = useStore(
    (store) => store.campaigns.currentCampaign.tracks.updateCharacterTrack
  );
  const removeCharacterProgressTrack = useStore(
    (store) => store.campaigns.currentCampaign.tracks.removeCharacterTrack
  );

  return (
    <Stack spacing={2}>
      <SectionHeading label={"Supply"} />
      <Track
        sx={(theme) => ({
          mt: 4,
          mb: 4,
          maxWidth: 400,
          px: 2,
          [theme.breakpoints.up("md")]: { px: 3 },
        })}
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
          handleAdd={(newTrack) =>
            addCampaignProgressTrack(TRACK_TYPES.FRAY, newTrack)
          }
          handleUpdateValue={(trackId, value) =>
            updateCampaignProgressTrackValue(TRACK_TYPES.FRAY, trackId, value)
          }
          handleUpdateTrack={(trackId, track) =>
            updateCampaignProgressTrack(TRACK_TYPES.FRAY, trackId, track)
          }
          handleDeleteTrack={(trackId) =>
            removeCampaignProgressTrack(TRACK_TYPES.FRAY, trackId)
          }
        />
        <ProgressTrackList
          tracks={vows}
          trackType={TRACK_TYPES.VOW}
          typeLabel={"Shared Vow"}
          handleAdd={(newTrack) =>
            addCampaignProgressTrack(TRACK_TYPES.VOW, newTrack)
          }
          handleUpdateValue={(trackId, value) =>
            updateCampaignProgressTrackValue(TRACK_TYPES.VOW, trackId, value)
          }
          handleUpdateTrack={(trackId, track) =>
            updateCampaignProgressTrack(TRACK_TYPES.VOW, trackId, track)
          }
          handleDeleteTrack={(trackId) =>
            removeCampaignProgressTrack(TRACK_TYPES.VOW, trackId)
          }
        />
        <ProgressTrackList
          tracks={journeys}
          trackType={TRACK_TYPES.JOURNEY}
          typeLabel={"Shared Journey"}
          handleAdd={(newTrack) =>
            addCampaignProgressTrack(TRACK_TYPES.JOURNEY, newTrack)
          }
          handleUpdateValue={(trackId, value) =>
            updateCampaignProgressTrackValue(
              TRACK_TYPES.JOURNEY,
              trackId,
              value
            )
          }
          handleUpdateTrack={(trackId, track) =>
            updateCampaignProgressTrack(TRACK_TYPES.JOURNEY, trackId, track)
          }
          handleDeleteTrack={(trackId) =>
            removeCampaignProgressTrack(TRACK_TYPES.JOURNEY, trackId)
          }
        />
        {Object.keys(characterTracks).map((characterId) => (
          <div key={characterId}>
            {characters[characterId] &&
              characterTracks[characterId]?.[TRACK_TYPES.VOW]?.length > 0 && (
                <ProgressTrackList
                  tracks={characterTracks[characterId][TRACK_TYPES.VOW]}
                  trackType={TRACK_TYPES.VOW}
                  typeLabel={characters[characterId].name + "'s Vow"}
                  handleUpdateValue={(trackId, value) =>
                    updateCharacterProgressTrackValue(
                      characterId,
                      TRACK_TYPES.VOW,
                      trackId,
                      value
                    )
                  }
                  handleUpdateTrack={(trackId, track) =>
                    updateCharacterProgressTrack(
                      characterId,
                      TRACK_TYPES.VOW,
                      trackId,
                      track
                    )
                  }
                />
              )}
          </div>
        ))}
      </div>
    </Stack>
  );
}
