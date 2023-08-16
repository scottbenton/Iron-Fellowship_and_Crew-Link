import { ProgressTrackList } from "components/ProgressTrack";
import { useStore } from "stores/store";
import { TRACK_TYPES } from "types/Track.type";

export interface CampaignProgressTracksProps {
  campaignId: string;
  addPadding?: boolean;
}

export function CampaignProgressTracks(props: CampaignProgressTracksProps) {
  const { campaignId, addPadding } = props;

  const vows = useStore(
    (store) => store.campaigns.currentCampaign.tracks.trackMap[TRACK_TYPES.VOW]
  );
  const journeys = useStore(
    (store) =>
      store.campaigns.currentCampaign.tracks.trackMap[TRACK_TYPES.JOURNEY]
  );
  const frays = useStore(
    (store) => store.campaigns.currentCampaign.tracks.trackMap[TRACK_TYPES.FRAY]
  );

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

  return (
    <>
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
        headingBreakContainer={!addPadding}
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
        headingBreakContainer={!addPadding}
      />
      <ProgressTrackList
        tracks={journeys}
        trackType={TRACK_TYPES.JOURNEY}
        typeLabel={"Shared Journey"}
        handleAdd={(newTrack) =>
          addCampaignProgressTrack(TRACK_TYPES.JOURNEY, newTrack)
        }
        handleUpdateValue={(trackId, value) =>
          updateCampaignProgressTrackValue(TRACK_TYPES.JOURNEY, trackId, value)
        }
        handleUpdateTrack={(trackId, track) =>
          updateCampaignProgressTrack(TRACK_TYPES.JOURNEY, trackId, track)
        }
        handleDeleteTrack={(trackId) =>
          removeCampaignProgressTrack(TRACK_TYPES.JOURNEY, trackId)
        }
        headingBreakContainer={!addPadding}
      />
    </>
  );
}
