import { Box } from "@mui/material";
import { ProgressTrackList } from "components/features/ProgressTrack";
import { TRACK_STATUS, TRACK_TYPES } from "types/Track.type";
import { useStore } from "stores/store";

export interface ProgressTrackSectionProps {
  type: TRACK_TYPES.FRAY | TRACK_TYPES.JOURNEY | TRACK_TYPES.VOW;
  typeLabel: string;
  showPersonalIfInCampaign?: boolean;
}

export function ProgressTrackSection(props: ProgressTrackSectionProps) {
  const { type, typeLabel, showPersonalIfInCampaign } = props;

  const characterTracks = useStore(
    (store) => store.characters.currentCharacter.tracks.trackMap[type]
  );
  const addProgressTrack = useStore(
    (store) => store.characters.currentCharacter.tracks.addTrack
  );
  const updateProgressTrack = useStore(
    (store) => store.characters.currentCharacter.tracks.updateTrack
  );

  const isInCampaign = useStore(
    (store) => !!store.campaigns.currentCampaign.currentCampaignId
  );

  const campaignTracks = useStore(
    (store) => store.campaigns.currentCampaign.tracks.trackMap[type]
  );
  const addCampaignTrack = useStore(
    (store) => store.campaigns.currentCampaign.tracks.addTrack
  );
  const updateCampaignTrack = useStore(
    (store) => store.campaigns.currentCampaign.tracks.updateTrack
  );

  return (
    <Box>
      {isInCampaign && (
        <ProgressTrackList
          trackType={type}
          tracks={campaignTracks}
          typeLabel={`Campaign ${typeLabel}`}
          handleAdd={(newTrack) => addCampaignTrack(newTrack)}
          handleUpdateValue={(trackId, value) =>
            updateCampaignTrack(trackId, { value })
          }
          handleUpdateTrack={(trackId, track) =>
            updateCampaignTrack(trackId, track)
          }
          handleDeleteTrack={(trackId) =>
            updateCampaignTrack(trackId, { status: TRACK_STATUS.COMPLETED })
          }
        />
      )}
      {(!isInCampaign || showPersonalIfInCampaign) && (
        <ProgressTrackList
          trackType={type}
          tracks={characterTracks}
          typeLabel={`Character ${typeLabel}`}
          handleAdd={(newTrack) => addProgressTrack(newTrack)}
          handleUpdateValue={(trackId, value) =>
            updateProgressTrack(trackId, { value })
          }
          handleUpdateTrack={(trackId, track) =>
            updateProgressTrack(trackId, track)
          }
          handleDeleteTrack={(trackId) =>
            updateProgressTrack(trackId, { status: TRACK_STATUS.COMPLETED })
          }
        />
      )}
    </Box>
  );
}
