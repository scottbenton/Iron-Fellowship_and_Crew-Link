import { Box } from "@mui/material";
import { ProgressTrackList } from "components/features/ProgressTrack";
import { TRACK_TYPES } from "types/Track.type";
import { useStore } from "stores/store";

export interface ProgressTrackSectionProps {
  type: TRACK_TYPES;
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
  const updateProgressTrackValue = useStore(
    (store) => store.characters.currentCharacter.tracks.updateTrackValue
  );
  const updateProgressTrack = useStore(
    (store) => store.characters.currentCharacter.tracks.updateTrack
  );
  const removeProgressTrack = useStore(
    (store) => store.characters.currentCharacter.tracks.removeTrack
  );

  const campaignTracks = useStore(
    (store) => store.campaigns.currentCampaign.tracks.trackMap[type]
  );
  const addCampaignTrack = useStore(
    (store) => store.campaigns.currentCampaign.tracks.addTrack
  );
  const updateCampaignTrackValue = useStore(
    (store) => store.campaigns.currentCampaign.tracks.updateTrackValue
  );
  const updateCampaignTrack = useStore(
    (store) => store.campaigns.currentCampaign.tracks.updateTrack
  );
  const removeCampaignTrackValue = useStore(
    (store) => store.campaigns.currentCampaign.tracks.removeTrack
  );

  return (
    <Box>
      {Array.isArray(campaignTracks) && (
        <ProgressTrackList
          trackType={type}
          tracks={campaignTracks}
          typeLabel={`Campaign ${typeLabel}`}
          handleAdd={(newTrack) => addCampaignTrack(type, newTrack)}
          handleUpdateValue={(trackId, value) =>
            updateCampaignTrackValue(type, trackId, value)
          }
          handleUpdateTrack={(trackId, track) =>
            updateCampaignTrack(type, trackId, track)
          }
          handleDeleteTrack={(trackId) =>
            removeCampaignTrackValue(type, trackId)
          }
        />
      )}
      {((Array.isArray(campaignTracks) && showPersonalIfInCampaign) ||
        !Array.isArray(campaignTracks)) && (
        <ProgressTrackList
          trackType={type}
          tracks={characterTracks}
          typeLabel={`Character ${typeLabel}`}
          handleAdd={(newTrack) => addProgressTrack(type, newTrack)}
          handleUpdateValue={(trackId, value) =>
            updateProgressTrackValue(type, trackId, value)
          }
          handleUpdateTrack={(trackId, track) =>
            updateProgressTrack(type, trackId, track)
          }
          handleDeleteTrack={(trackId) => removeProgressTrack(type, trackId)}
        />
      )}
    </Box>
  );
}
