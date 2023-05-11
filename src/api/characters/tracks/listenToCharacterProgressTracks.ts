import { onSnapshot, Unsubscribe } from "firebase/firestore";
import { useEffect, useState } from "react";
import { getErrorMessage } from "functions/getErrorMessage";
import { useAuth } from "providers/AuthProvider";
import { useSnackbar } from "hooks/useSnackbar";
import { getCharacterTracksDoc } from "./_getRef";
import {
  convertTrackMapToArray,
  TrackWithId,
  useCharacterSheetStore,
} from "pages/Character/CharacterSheetPage/characterSheet.store";
import { TRACK_TYPES } from "types/Track.type";

export function listenToCharacterProgressTracks(
  uid: string,
  characterId: string,
  onTracks: (
    vows: TrackWithId[],
    journeys: TrackWithId[],
    frays: TrackWithId[]
  ) => void,
  onError: (error: any) => void
) {
  return onSnapshot(
    getCharacterTracksDoc(uid, characterId),
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

export function useListenToCharacterProgressTracks() {
  const uid = useAuth().user?.uid;
  const characterId = useCharacterSheetStore((store) => store.characterId);
  const setProgressTracks = useCharacterSheetStore(
    (store) => store.setProgressTracks
  );

  const { error } = useSnackbar();

  useEffect(() => {
    let unsubscribe: Unsubscribe;
    if (uid && characterId) {
      listenToCharacterProgressTracks(
        uid,
        characterId,
        (newVows, newJourneys, newFrays) => {
          setProgressTracks(newVows, newJourneys, newFrays);
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
  }, [uid, characterId]);
}
