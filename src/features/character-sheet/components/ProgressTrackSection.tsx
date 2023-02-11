import { Box } from "@mui/material";
import { useUpdateCharacterSheetCampaignProgressTrack } from "api/campaign/tracks/updateCampaignProgressTrack";
import { useUpdateCharacterSheetCharacterProgressTrack } from "api/characters/tracks/updateCharacterProgressTrack";
import { useCharacterSheetAddProgressTrack } from "api/shared/addProgressTrack";
import { useCharacterSheetRemoveProgressTrack } from "api/shared/removeProgressTrack";
import { useCharacterSheetUpdateProgressTrack } from "api/shared/updateProgressTrack";
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

  const addProgressTrack = useCharacterSheetAddProgressTrack();
  const updateProgressTrack = useCharacterSheetUpdateProgressTrack();

  const removeProgressTrack = useCharacterSheetRemoveProgressTrack();

  return (
    <Box>
      {Array.isArray(tracks.campaign) && (
        <ProgressTrackList
          tracks={tracks.campaign}
          typeLabel={`Campaign ${typeLabel}`}
          handleAdd={(newTrack) =>
            addProgressTrack({ type, track: newTrack, isCampaign: true })
          }
          handleUpdateValue={(trackId, value) =>
            updateProgressTrack({ type, trackId, value, isCampaign: true })
          }
          handleDeleteTrack={(trackId) =>
            removeProgressTrack({ type, isCampaign: true, id: trackId })
          }
        />
      )}
      {((Array.isArray(tracks.campaign) && showPersonalIfInCampaign) ||
        !Array.isArray(tracks.campaign)) && (
        <ProgressTrackList
          tracks={tracks.character}
          typeLabel={`Character ${typeLabel}`}
          handleAdd={(newTrack) =>
            addProgressTrack({ type, track: newTrack, isCampaign: false })
          }
          handleUpdateValue={(trackId, value) =>
            updateProgressTrack({ type, trackId, value, isCampaign: false })
          }
          handleDeleteTrack={(trackId) =>
            removeProgressTrack({ type, isCampaign: false, id: trackId })
          }
        />
      )}
    </Box>
  );
}
