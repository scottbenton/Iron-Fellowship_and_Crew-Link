import { ProgressTrackList } from "components/features/ProgressTrack";
import { useGameSystem } from "hooks/useGameSystem";
import { GAME_SYSTEMS } from "types/GameSystems.type";
import { TRACK_TYPES } from "types/Track.type";

export interface CampaignProgressTracksProps {
  addPadding?: boolean;
}

export function CampaignProgressTracks(props: CampaignProgressTracksProps) {
  const { addPadding } = props;

  const isStarforged = useGameSystem().gameSystem === GAME_SYSTEMS.STARFORGED;

  return (
    <>
      <ProgressTrackList
        trackType={TRACK_TYPES.FRAY}
        typeLabel={"Shared Combat Track"}
        isCampaign
        headingBreakContainer={!addPadding}
      />
      <ProgressTrackList
        trackType={TRACK_TYPES.VOW}
        typeLabel={"Shared Vow"}
        isCampaign
        headingBreakContainer={!addPadding}
      />
      <ProgressTrackList
        trackType={TRACK_TYPES.JOURNEY}
        typeLabel={isStarforged ? "Shared Expedition" : "Shared Journey"}
        isCampaign
        headingBreakContainer={!addPadding}
      />
    </>
  );
}
