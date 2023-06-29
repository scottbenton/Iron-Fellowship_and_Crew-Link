import {
  limit,
  onSnapshot,
  orderBy,
  query,
  Unsubscribe,
} from "firebase/firestore";
import { useEffect, useRef, useState } from "react";
import { getErrorMessage } from "functions/getErrorMessage";
import { useAuth } from "providers/AuthProvider";
import { useSnackbar } from "hooks/useSnackbar";
import {
  convertTrackMapToArray,
  TrackWithId,
  useCharacterSheetStore,
} from "pages/Character/CharacterSheetPage/characterSheet.store";
import { TRACK_TYPES } from "types/Track.type";
import { Roll } from "types/DieRolls.type";
import { getCharacterRollsCollection } from "./_getRef";

export function listenToLastCharacterRoll(
  uid: string,
  characterId: string,
  onRoll: (roll: Roll) => void,
  onError: (error: any) => void
) {
  return onSnapshot(
    query(
      getCharacterRollsCollection(uid, characterId),
      orderBy("timestamp", "desc"),
      limit(1)
    ),
    (snapshot) => {
      const rolls = snapshot.docs;
      console.debug(rolls);

      if (rolls.length > 0) {
        onRoll(rolls[0].data());
      }
    },
    (error) => onError(error)
  );
}

export function useListenToLastCharacterRoll(
  uid: string | undefined,
  characterId: string | undefined
) {
  const firstRollRef = useRef<Roll>();
  const [lastRoll, setLastRoll] = useState<Roll>();

  const { error } = useSnackbar();

  useEffect(() => {
    let unsubscribe: Unsubscribe;
    if (uid && characterId) {
      listenToLastCharacterRoll(
        uid,
        characterId,
        (roll) => {
          console.debug(roll);
          if (!firstRollRef.current) {
            console.debug("FIRST ROLL REF WAS UNDEFINED, SETTING IT NOW");
            firstRollRef.current = roll;
          } else if (!areRollsEqual(firstRollRef.current, roll)) {
            console.debug("ROLL WAS NOT EQUAL", firstRollRef.current, roll);
            setLastRoll(roll);
          } else {
            console.debug("ROLL WAS EQUAL");
          }
        },
        (err) => {
          console.error(err);
          const errorMessage = getErrorMessage(
            error,
            "Failed to load last roll"
          );
          error(errorMessage);
        }
      );
    }

    return () => {
      unsubscribe && unsubscribe();
    };
  }, [uid, characterId]);

  return lastRoll;
}

function areRollsEqual(roll1: Roll, roll2: Roll) {
  return JSON.stringify(roll1) === JSON.stringify(roll2);
}
