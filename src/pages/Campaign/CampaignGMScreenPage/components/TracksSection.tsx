import { Stack } from "@mui/material";
import { useUpdateCampaignSupply } from "api/campaign/updateCampaignSupply";
import { SectionHeading } from "components/SectionHeading";
import { supplyTrack } from "data/defaultTracks";
import { Track } from "components/Track";
import { useCampaignGMScreenStore } from "../campaignGMScreen.store";
import { useAddCampaignProgressTrack } from "api/campaign/tracks/addCampaignProgressTrack";
import { useUpdateCampaignProgressTrackValue } from "api/campaign/tracks/updateCampaignProgressTrackValue";
import { useRemoveCampaignProgressTrack } from "api/campaign/tracks/removeCampaignProgressTrack";
import { TRACK_TYPES } from "types/Track.type";
import { TrackWithId } from "pages/Character/CharacterSheetPage/characterSheet.store";
import { ProgressTrackList } from "components/ProgressTrack";
import { useUpdateCharacterProgressTrackValue } from "api/characters/tracks/updateCharacterProgressTrackValue";
import { useUpdateCampaignProgressTrack } from "api/campaign/tracks/updateCampaignProgressTrack";
import { useUpdateCharacterProgressTrack } from "api/characters/tracks/updateCharacterProgressTrack";

export interface TracksSectionProps {
  campaignId: string;
  supply: number;
}
export function TracksSection(props: TracksSectionProps) {
  const { campaignId, supply } = props;

  const { updateCampaignSupply } = useUpdateCampaignSupply();

  const tracks: { [key in TRACK_TYPES]?: TrackWithId[] } =
    useCampaignGMScreenStore((store) => store.tracks) ?? {};

  const characterTracks = useCampaignGMScreenStore(
    (store) => store.characterTracks
  );
  const characters = useCampaignGMScreenStore((store) => store.characters);

  const vows = tracks[TRACK_TYPES.VOW];
  const journeys = tracks[TRACK_TYPES.JOURNEY];
  const frays = tracks[TRACK_TYPES.FRAY];

  const { addCampaignProgressTrack } = useAddCampaignProgressTrack();
  const { updateCampaignProgressTrackValue } =
    useUpdateCampaignProgressTrackValue();
  const { updateCharacterProgressTrack } = useUpdateCharacterProgressTrack();
  const { updateCampaignProgressTrack } = useUpdateCampaignProgressTrack();
  const { removeCampaignProgressTrack } = useRemoveCampaignProgressTrack();
  const { updateCharacterProgressTrackValue } =
    useUpdateCharacterProgressTrackValue();

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
            updateCampaignProgressTrackValue({
              campaignId,
              type: TRACK_TYPES.FRAY,
              trackId,
              value,
            })
          }
          handleUpdateTrack={(trackId, track) =>
            updateCampaignProgressTrack({
              campaignId,
              type: TRACK_TYPES.FRAY,
              trackId,
              track,
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
            updateCampaignProgressTrackValue({
              campaignId,
              type: TRACK_TYPES.VOW,
              trackId,
              value,
            })
          }
          handleUpdateTrack={(trackId, track) =>
            updateCampaignProgressTrack({
              campaignId,
              type: TRACK_TYPES.VOW,
              trackId,
              track,
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
            updateCampaignProgressTrackValue({
              campaignId,
              type: TRACK_TYPES.JOURNEY,
              trackId,
              value,
            })
          }
          handleUpdateTrack={(trackId, track) =>
            updateCampaignProgressTrack({
              campaignId,
              type: TRACK_TYPES.JOURNEY,
              trackId,
              track,
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
        {Object.keys(characterTracks).map((characterId) => (
          <div key={characterId}>
            {characters[characterId] &&
              characterTracks[characterId]?.[TRACK_TYPES.VOW]?.length > 0 && (
                <ProgressTrackList
                  tracks={characterTracks[characterId][TRACK_TYPES.VOW]}
                  trackType={TRACK_TYPES.VOW}
                  typeLabel={characters[characterId].name + "'s Vow"}
                  handleUpdateValue={(trackId, value) =>
                    updateCharacterProgressTrackValue({
                      uid: characters[characterId].uid,
                      characterId: characterId,
                      type: TRACK_TYPES.VOW,
                      trackId,
                      value,
                    })
                  }
                  handleUpdateTrack={(trackId, track) =>
                    updateCharacterProgressTrack({
                      uid: characters[characterId].uid,
                      characterId: characterId,
                      type: TRACK_TYPES.VOW,
                      trackId,
                      track,
                    })
                  }
                />
              )}
          </div>
        ))}
      </div>
    </Stack>
  );
}
