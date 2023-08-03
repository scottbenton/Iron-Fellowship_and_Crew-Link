import { Unsubscribe } from "firebase/firestore";
import { useEffect } from "react";
import { getErrorMessage } from "../../../functions/getErrorMessage";
import { useSnackbar } from "../../../providers/SnackbarProvider/useSnackbar";
import { useCampaignStore } from "../../../stores/campaigns.store";
import { useCampaignGMScreenStore } from "pages/Campaign/CampaignGMScreenPage/campaignGMScreen.store";
import { listenToCharacterProgressTracks } from "./listenToCharacterProgressTracks";
import { TrackWithId } from "pages/Character/CharacterSheetPage/characterSheet.store";
import { TRACK_TYPES } from "types/Track.type";

interface Params {
  characterIdList: { characterId: string; uid: string }[] | undefined;
  onProgressTrackChange: (
    id: string,
    tracks: {
      [TRACK_TYPES.VOW]: TrackWithId[];
      [TRACK_TYPES.FRAY]: TrackWithId[];
      [TRACK_TYPES.JOURNEY]: TrackWithId[];
    }
  ) => void;
  onError: (error: any) => void;
}

export function listenToCampaignCharacterProgressTracks(
  params: Params
): Unsubscribe[] {
  const { characterIdList, onProgressTrackChange, onError } = params;

  const unsubscribes = (characterIdList || []).map((character) => {
    return listenToCharacterProgressTracks(
      character.uid,
      character.characterId,
      (vows, journeys, frays) =>
        onProgressTrackChange(character.characterId, {
          [TRACK_TYPES.VOW]: vows,
          [TRACK_TYPES.JOURNEY]: journeys,
          [TRACK_TYPES.FRAY]: frays,
        }),
      onError
    );
  });
  return unsubscribes;
}

export function useCampaignGMScreenListenToCampaignCharacterProgressTracks() {
  const { error } = useSnackbar();

  const campaignId = useCampaignGMScreenStore((store) => store.campaignId);
  const characters = useCampaignStore(
    (store) => store.campaigns[campaignId ?? ""]?.characters
  );

  const updateCharacterTracks = useCampaignGMScreenStore(
    (store) => store.setCharacterTracks
  );

  useEffect(() => {
    let unsubscribes = listenToCampaignCharacterProgressTracks({
      characterIdList: characters,
      onProgressTrackChange: (id, tracks) => {
        updateCharacterTracks(id, tracks);
      },
      onError: (err) => {
        console.error(err);
        const errorMessage = getErrorMessage(
          error,
          "Failed to load character assets"
        );
        error(errorMessage);
      },
    });

    return () => {
      unsubscribes?.forEach((unsubscribe) => unsubscribe());
    };
  }, [characters]);
}
