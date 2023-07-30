import { Box } from "@mui/material";
import { useCharacterSheetAddProgressTrack } from "api/shared/addProgressTrack";
import { useCharacterSheetRemoveProgressTrack } from "api/shared/removeProgressTrack";
import { useCharacterSheetUpdateProgressTrackValue } from "api/shared/updateProgressTrackValue";
import { ProgressTrackList } from "components/ProgressTrack";
import { TRACK_TYPES } from "types/Track.type";
import { useCharacterSheetStore } from "../characterSheet.store";
import { useCharacterSheetUpdateProgressTrack } from "api/shared/updateProgressTrack";

export interface ProgressTrackSectionProps {
  type: TRACK_TYPES;
  typeLabel: string;
  showPersonalIfInCampaign?: boolean;
}

export function ProgressTrackSection(props: ProgressTrackSectionProps) {
  const { type, typeLabel, showPersonalIfInCampaign } = props;

  const tracks = useCharacterSheetStore((store) => store[type]);

  const addProgressTrack = useCharacterSheetAddProgressTrack();
  const updateProgressTrackValue = useCharacterSheetUpdateProgressTrackValue();
  const updateProgressTrack = useCharacterSheetUpdateProgressTrack();
  const removeProgressTrack = useCharacterSheetRemoveProgressTrack();

  return (
    <Box>
      {Array.isArray(tracks.campaign) && (
        <ProgressTrackList
          trackType={type}
          tracks={tracks.campaign}
          typeLabel={`Campaign ${typeLabel}`}
          handleAdd={(newTrack) =>
            addProgressTrack({ type, track: newTrack, isCampaign: true })
          }
          handleUpdateValue={(trackId, value) =>
            updateProgressTrackValue({ type, trackId, value, isCampaign: true })
          }
          handleUpdateTrack={(trackId, track) =>
            updateProgressTrack({ type, trackId, track, isCampaign: true })
          }
          handleDeleteTrack={(trackId) =>
            removeProgressTrack({ type, isCampaign: true, id: trackId })
          }
        />
      )}
      {((Array.isArray(tracks.campaign) && showPersonalIfInCampaign) ||
        !Array.isArray(tracks.campaign)) && (
        <ProgressTrackList
          trackType={type}
          tracks={tracks.character}
          typeLabel={`Character ${typeLabel}`}
          handleAdd={(newTrack) =>
            addProgressTrack({ type, track: newTrack, isCampaign: false })
          }
          handleUpdateValue={(trackId, value) =>
            updateProgressTrackValue({
              type,
              trackId,
              value,
              isCampaign: false,
            })
          }
          handleUpdateTrack={(trackId, track) =>
            updateProgressTrack({ type, trackId, track, isCampaign: false })
          }
          handleDeleteTrack={(trackId) =>
            removeProgressTrack({ type, isCampaign: false, id: trackId })
          }
        />
      )}
    </Box>
  );
}
