import { firebaseAuth } from "config/firebase.config";
import { useCampaignGMScreenStore } from "pages/Campaign/CampaignGMScreenPage/campaignGMScreen.store";
import { useCharacterSheetStore } from "pages/Character/CharacterSheetPage/characterSheet.store";
import { onSnapshot, setDoc, Unsubscribe } from "firebase/firestore";
import { getErrorMessage } from "functions/getErrorMessage";
import { useAuth } from "providers/AuthProvider";
import { useSnackbar } from "hooks/useSnackbar";
import { useEffect } from "react";
import { useCampaignStore } from "stores/campaigns.store";
import { StoredMove } from "types/Moves.type";
import { getUserCustomMovesDoc } from "./_getRef";

export function listenToCustomMoves(
  uid: string,
  onCustomMoves: (moves: StoredMove[]) => void,
  onError: (error: any) => void
) {
  return onSnapshot(
    getUserCustomMovesDoc(uid),
    (snapshot) => {
      if (snapshot.exists()) {
        const data = snapshot.data();
        onCustomMoves(data.moveOrder.map((moveId) => data.moves[moveId]));
      } else if (uid === firebaseAuth.currentUser?.uid) {
        setDoc(getUserCustomMovesDoc(uid), {
          moves: {},
          moveOrder: [],
        });
      } else {
        onCustomMoves([]);
      }
    },
    (error) => onError(error)
  );
}

export function useCampaignGMScreenListenToCustomMoves() {
  const uid = useAuth().user?.uid;
  const setMoves = useCampaignGMScreenStore((store) => store.setCustomMoves);

  const { error } = useSnackbar();

  useEffect(() => {
    let unsubscribe: Unsubscribe;

    if (uid) {
      unsubscribe = listenToCustomMoves(uid, setMoves, (err) => {
        console.error(err);
        const errorMessage = getErrorMessage(
          error,
          "Failed to retrieve custom moves"
        );
        error(errorMessage);
      });
    }

    return () => {
      unsubscribe && unsubscribe();
    };
  }, [uid]);
}

export function useCharacterSheetListenToCustomMoves() {
  const campaignId = useCharacterSheetStore((store) => store.campaignId);
  const gmUid = useCampaignStore((store) =>
    campaignId ? store.campaigns[campaignId]?.gmId : undefined
  );
  const userId = useAuth().user?.uid;

  const uid = campaignId ? gmUid : userId;

  const setMoves = useCharacterSheetStore((store) => store.setCustomMoves);

  const { error } = useSnackbar();

  useEffect(() => {
    let unsubscribe: Unsubscribe;
    if (uid) {
      unsubscribe = listenToCustomMoves(
        uid,
        (moves) => {
          setMoves(moves);
        },
        (err) => {
          console.error(err);
          const errorMessage = getErrorMessage(
            error,
            "Failed to retrieve custom moves"
          );
          error(errorMessage);
        }
      );
    }

    return () => {
      unsubscribe && unsubscribe();
    };
  }, [uid]);
}
