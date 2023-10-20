import { ProgressTrackList } from "components/features/ProgressTrack";
import { useGameSystem } from "hooks/useGameSystem";
import { useStore } from "stores/store";
import { GAME_SYSTEMS } from "types/GameSystems.type";
import { TRACK_STATUS, TRACK_TYPES } from "types/Track.type";

export interface CampaignProgressTracksProps {
  campaignId: string;
  addPadding?: boolean;
}

export function CampaignProgressTracks(props: CampaignProgressTracksProps) {
  const { campaignId, addPadding } = props;

  const isStarforged = useGameSystem().gameSystem === GAME_SYSTEMS.STARFORGED;

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
  const updateCampaignProgressTrack = useStore(
    (store) => store.campaigns.currentCampaign.tracks.updateTrack
  );

  return (
    <>
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
        headingBreakContainer={!addPadding}
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
        headingBreakContainer={!addPadding}
      />
      <ProgressTrackList
        tracks={journeys}
        trackType={TRACK_TYPES.JOURNEY}
        typeLabel={isStarforged ? "Shared Exploration" : "Shared Journey"}
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
        headingBreakContainer={!addPadding}
      />
    </>
  );
}
