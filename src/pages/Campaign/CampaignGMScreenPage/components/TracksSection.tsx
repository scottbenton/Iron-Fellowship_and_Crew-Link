import { Stack } from "@mui/material";
import { useUpdateCampaignSupply } from "api/campaign/updateCampaignSupply";
import { SectionHeading } from "components/SectionHeading";
import { supplyTrack } from "data/defaultTracks";
import { Track } from "components/Track";
import { useCampaignGMScreenStore } from "../campaignGMScreen.store";
import { useAddCampaignProgressTrack } from "api/campaign/tracks/addCampaignProgressTrack";
import { useUpdateCampaignProgressTrack } from "api/campaign/tracks/updateCampaignProgressTrack";
import { useRemoveCampaignProgressTrack } from "api/campaign/tracks/removeCampaignProgressTrack";
import { TRACK_TYPES } from "types/Track.type";
import { TrackWithId } from "pages/Character/CharacterSheetPage/characterSheet.store";
import { ProgressTrackList } from "components/ProgressTrackList";

export interface TracksSectionProps {
  campaignId: string;
  supply: number;
}
export function TracksSection(props: TracksSectionProps) {
  const { campaignId, supply } = props;

  const { updateCampaignSupply } = useUpdateCampaignSupply();

  const tracks: { [key in TRACK_TYPES]?: TrackWithId[] } =
    useCampaignGMScreenStore((store) => store.tracks) ?? {};

  const vows = tracks[TRACK_TYPES.VOW];
  const journeys = tracks[TRACK_TYPES.JOURNEY];
  const frays = tracks[TRACK_TYPES.FRAY];

  const { addCampaignProgressTrack } = useAddCampaignProgressTrack();
  const { updateCampaignProgressTrack } = useUpdateCampaignProgressTrack();
  const { removeCampaignProgressTrack } = useRemoveCampaignProgressTrack();

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
        onChange={(newValue) =>
          updateCampaignSupply({ campaignId, supply: newValue })
        }
      />
      <div>
        <ProgressTrackList
          tracks={vows}
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
        />
        <ProgressTrackList
          tracks={frays}
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
        />
        <ProgressTrackList
          tracks={journeys}
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
        />
      </div>
    </Stack>
  );
}
