import { useAddCampaignProgressTrack } from "api/campaign/tracks/addCampaignProgressTrack";
import { useListenToCampaignProgressTracks } from "api/campaign/tracks/listenToCampaignProgressTracks";
import { useRemoveCampaignProgressTrack } from "api/campaign/tracks/removeCampaignProgressTrack";
import { useUpdateCampaignProgressTrack } from "api/campaign/tracks/updateCampaignProgressTrack";
import { ProgressTrackList } from "components/ProgressTrackList";
import { TRACK_TYPES } from "types/Track.type";

export interface CampaignProgressTracksProps {
  campaignId: string;
  addPadding?: boolean;
}

export function CampaignProgressTracks(props: CampaignProgressTracksProps) {
  const { campaignId, addPadding } = props;

  const { vows, journeys, frays } =
    useListenToCampaignProgressTracks(campaignId);

  const { addCampaignProgressTrack } = useAddCampaignProgressTrack();
  const { updateCampaignProgressTrack } = useUpdateCampaignProgressTrack();
  const { removeCampaignProgressTrack } = useRemoveCampaignProgressTrack();

  return (
    <>
      <ProgressTrackList
        tracks={vows}
        trackType={TRACK_TYPES.VOW}
        typeLabel={"Shared Vow"}
        handleAdd={(newTrack) =>
          addCampaignProgressTrack({
            campaignId,
            type: TRACK_TYPES.VOW,
            track: newTrack,
          })
        }
        handleUpdateValue={(trackId, value) =>
          updateCampaignProgressTrack({
            campaignId,
            type: TRACK_TYPES.VOW,
            trackId,
            value,
          })
        }
        handleDeleteTrack={(trackId) =>
          removeCampaignProgressTrack({
            campaignId,
            type: TRACK_TYPES.VOW,
            id: trackId,
          })
        }
        headingBreakContainer={!addPadding}
      />
      <ProgressTrackList
        tracks={frays}
        trackType={TRACK_TYPES.FRAY}
        typeLabel={"Shared Combat Track"}
        handleAdd={(newTrack) =>
          addCampaignProgressTrack({
            campaignId,
            type: TRACK_TYPES.FRAY,
            track: newTrack,
          })
        }
        handleUpdateValue={(trackId, value) =>
          updateCampaignProgressTrack({
            campaignId,
            type: TRACK_TYPES.FRAY,
            trackId,
            value,
          })
        }
        handleDeleteTrack={(trackId) =>
          removeCampaignProgressTrack({
            campaignId,
            type: TRACK_TYPES.FRAY,
            id: trackId,
          })
        }
        headingBreakContainer={!addPadding}
      />
      <ProgressTrackList
        tracks={journeys}
        trackType={TRACK_TYPES.JOURNEY}
        typeLabel={"Shared Journey"}
        handleAdd={(newTrack) =>
          addCampaignProgressTrack({
            campaignId,
            type: TRACK_TYPES.JOURNEY,
            track: newTrack,
          })
        }
        handleUpdateValue={(trackId, value) =>
          updateCampaignProgressTrack({
            campaignId,
            type: TRACK_TYPES.JOURNEY,
            trackId,
            value,
          })
        }
        handleDeleteTrack={(trackId) =>
          removeCampaignProgressTrack({
            campaignId,
            type: TRACK_TYPES.JOURNEY,
            id: trackId,
          })
        }
        headingBreakContainer={!addPadding}
      />
    </>
  );
}
