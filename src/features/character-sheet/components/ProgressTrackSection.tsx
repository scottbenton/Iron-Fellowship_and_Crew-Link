import { TrackChangesOutlined } from "@mui/icons-material";
import { Box, Stack, Typography } from "@mui/material";
import { AddTrackDialog } from "../../../components/AddTrackDialog/AddTrackDialog";
import { ProgressTrack } from "../../../components/ProgressTrack";
import { ProgressTrackList } from "../../../components/ProgressTrackList";
import { TRACK_TYPES } from "../../../types/Track.type";
import { useCharacterSheetStore } from "../characterSheet.store";

export interface ProgressTrackSectionProps {
  type: TRACK_TYPES;
  typeLabel: string;
  showPersonalIfInCampaign?: boolean;
}

export function ProgressTrackSection(props: ProgressTrackSectionProps) {
  const { type, typeLabel, showPersonalIfInCampaign } = props;

  const tracks = useCharacterSheetStore((store) => store[type]);

  const addProgressTrack = useCharacterSheetStore(
    (store) => store.addProgressTrack
  );

  const updateProgressTrackValue = useCharacterSheetStore(
    (store) => store.updateProgressTrackValue
  );
  const removeProgressTrack = useCharacterSheetStore(
    (store) => store.removeProgressTrack
  );

  return (
    <Box>
      {Array.isArray(tracks.campaign) && (
        <ProgressTrackList
          tracks={tracks.campaign}
          typeLabel={`Campaign ${typeLabel}`}
          handleAdd={(newTrack) => addProgressTrack(type, newTrack, true)}
          handleUpdateValue={(trackId, value) =>
            updateProgressTrackValue(type, true, trackId, value)
          }
          handleDeleteTrack={(trackId) =>
            removeProgressTrack(type, true, trackId)
          }
        />
      )}
      {((Array.isArray(tracks.campaign) && showPersonalIfInCampaign) ||
        !Array.isArray(tracks.campaign)) && (
        <ProgressTrackList
          tracks={tracks.character}
          typeLabel={`Character ${typeLabel}`}
          handleAdd={(newTrack) => addProgressTrack(type, newTrack, false)}
          handleUpdateValue={(trackId, value) =>
            updateProgressTrackValue(type, false, trackId, value)
          }
          handleDeleteTrack={(trackId) =>
            removeProgressTrack(type, false, trackId)
          }
        />
      )}
    </Box>
  );
}
