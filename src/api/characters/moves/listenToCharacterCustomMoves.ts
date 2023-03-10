import { useCharacterSheetStore } from "features/character-sheet/characterSheet.store";
import { onSnapshot, setDoc, Unsubscribe } from "firebase/firestore";
import { getErrorMessage } from "functions/getErrorMessage";
import { useAuth } from "hooks/useAuth";
import { useSnackbar } from "hooks/useSnackbar";
import { useEffect } from "react";
import { StoredMove } from "types/Moves.type";
import { getCharacterCustomMovesDoc } from "./_getRef";

export function listenToCharacterCustomMoves(
  uid: string,
  characterId: string,
  onCustomMoves: (moves: StoredMove[]) => void,
  onError: (error: any) => void
) {
  return onSnapshot(
    getCharacterCustomMovesDoc(uid, characterId),
    (snapshot) => {
      if (snapshot.exists()) {
        const data = snapshot.data();
        onCustomMoves(data.moveOrder.map((moveId) => data.moves[moveId]));
      } else {
        setDoc(getCharacterCustomMovesDoc(uid, characterId), {
          moves: {},
          moveOrder: [],
        });
      }
    },
    (error) => onError(error)
  );
}

export function useCharacterSheetListenToCharacterCustomMoves() {
  const uid = useAuth().user?.uid;
  const campaignId = useCharacterSheetStore((store) => store.campaignId);
  const characterId = useCharacterSheetStore((store) => store.characterId);
  const setMoves = useCharacterSheetStore((store) => store.setCustomMoves);

  const { error } = useSnackbar();

  useEffect(() => {
    let unsubscribe: Unsubscribe;

    if (uid && characterId && !campaignId) {
      unsubscribe = listenToCharacterCustomMoves(
        uid,
        characterId,
        setMoves,
        (err) => {
          console.error(err);
          const errorMessage = getErrorMessage(
            error,
            "Failed to retrieve campaign settings"
          );
          error(errorMessage);
        }
      );
    }

    return () => {
      unsubscribe && unsubscribe();
    };
  }, [uid, campaignId, characterId]);
}
