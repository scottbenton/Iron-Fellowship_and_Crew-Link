import { onSnapshot, Unsubscribe } from "firebase/firestore";
import { useEffect, useState } from "react";
import {
  convertTrackMapToArray,
  TrackWithId,
  useCharacterSheetStore,
} from "pages/Character/CharacterSheetPage/characterSheet.store";
import { getSharedCampaignTracksDoc } from "./_getRef";
import { TRACK_TYPES } from "types/Track.type";
import { getErrorMessage } from "functions/getErrorMessage";
import { useSnackbar } from "hooks/useSnackbar";
import { useCampaignGMScreenStore } from "pages/Campaign/CampaignGMScreenPage/campaignGMScreen.store";

export function listenToCampaignProgressTracks(
  campaignId: string,
  onTracks: (
    vows: TrackWithId[],
    journeys: TrackWithId[],
    frays: TrackWithId[]
  ) => void,
  onError: (error: any) => void
): Unsubscribe | undefined {
  return onSnapshot(
    getSharedCampaignTracksDoc(campaignId),
    (snapshot) => {
      const data = snapshot.data();

      const vows = convertTrackMapToArray(data?.[TRACK_TYPES.VOW] ?? {});
      const journeys = convertTrackMapToArray(
        data?.[TRACK_TYPES.JOURNEY] ?? {}
      );
      const frays = convertTrackMapToArray(data?.[TRACK_TYPES.FRAY] ?? {});

      onTracks(vows, journeys, frays);
    },
    (error) => onError(error)
  );
}

export function useListenToCampaignProgressTracks(campaignId?: string) {
  const [vows, setVows] = useState<TrackWithId[]>();
  const [frays, setFrays] = useState<TrackWithId[]>();
  const [journeys, setJourneys] = useState<TrackWithId[]>();

  const { error } = useSnackbar();

  useEffect(() => {
    let unsubscribe: Unsubscribe;
    if (campaignId) {
      listenToCampaignProgressTracks(
        campaignId,
        (newVows, newJourneys, newFrays) => {
          setVows(newVows);
          setJourneys(newJourneys);
          setFrays(newFrays);
        },
        (err) => {
          console.error(err);
          const errorMessage = getErrorMessage(
            error,
            "Failed to load campaigns"
          );
          error(errorMessage);
        }
      );
    }

    return () => {
      unsubscribe && unsubscribe();
    };
  }, [campaignId]);

  return { vows, journeys, frays };
}

export function useCampaignGMScreenListenToCampaignProgressTracks() {
  const campaignId = useCampaignGMScreenStore((store) => store.campaignId);
  const setTracks = useCampaignGMScreenStore((store) => store.setTracks);

  const { error } = useSnackbar();

  useEffect(() => {
    let unsubscribe: Unsubscribe;
    if (campaignId) {
      listenToCampaignProgressTracks(
        campaignId,
        (newVows, newJourneys, newFrays) => {
          setTracks({
            [TRACK_TYPES.VOW]: newVows,
            [TRACK_TYPES.JOURNEY]: newJourneys,
            [TRACK_TYPES.FRAY]: newFrays,
          });
        },
        (err) => {
          console.error(err);
          const errorMessage = getErrorMessage(
            error,
            "Failed to load campaign progress tracks"
          );
          error(errorMessage);
        }
      );
    }

    return () => {
      unsubscribe && unsubscribe();
    };
  }, [campaignId]);
}

export function useListenToCampaignProgressTracksCharacterSheet() {
  const campaignId = useCharacterSheetStore((store) => store.campaignId);
  const setProgressTracks = useCharacterSheetStore(
    (store) => store.setProgressTracks
  );

  const { error } = useSnackbar();

  useEffect(() => {
    let unsubscribe: Unsubscribe;
    if (campaignId) {
      listenToCampaignProgressTracks(
        campaignId,
        (newVows, newJourneys, newFrays) => {
          setProgressTracks(newVows, newJourneys, newFrays, true);
        },
        (err) => {
          console.error(err);
          const errorMessage = getErrorMessage(
            error,
            "Failed to load campaigns"
          );
          error(errorMessage);
        }
      );
    }

    return () => {
      unsubscribe && unsubscribe();
    };
  }, [campaignId]);
}
