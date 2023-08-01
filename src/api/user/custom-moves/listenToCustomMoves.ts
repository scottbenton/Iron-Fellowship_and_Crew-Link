import { firebaseAuth } from "config/firebase.config";
import { useCampaignGMScreenStore } from "pages/Campaign/CampaignGMScreenPage/campaignGMScreen.store";
import { useCharacterSheetStore } from "pages/Character/CharacterSheetPage/characterSheet.store";
import { onSnapshot, setDoc, Unsubscribe } from "firebase/firestore";
import { getErrorMessage } from "functions/getErrorMessage";
import { useAuth } from "providers/AuthProvider";
import { useSnackbar } from "hooks/useSnackbar";
import { useEffect, useMemo } from "react";
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
  const gmIds = useCampaignGMScreenStore(
    (store) => store.campaign?.gmIds ?? []
  );
  const setMoves = useCampaignGMScreenStore((store) => store.setCustomMoves);

  const { error } = useSnackbar();

  useEffect(() => {
    let unsubscribes: Unsubscribe[] = gmIds.map((gmId) =>
      listenToCustomMoves(
        gmId,
        (moves) => setMoves(gmId, moves),
        (err) => {
          console.error(err);
          const errorMessage = getErrorMessage(
            error,
            "Failed to retrieve custom moves"
          );
          error(errorMessage);
        }
      )
    );

    return () => {
      unsubscribes.map((unsubscribe) => unsubscribe());
    };
  }, [gmIds]);
}

export function useCharacterSheetListenToCustomMoves() {
  const campaignId = useCharacterSheetStore((store) => store.campaignId);
  const gmIds = useCampaignStore(
    (store) => store.campaigns[campaignId ?? ""]?.gmIds ?? [],
    (a, b) => (a && b ? JSON.stringify(a) === JSON.stringify(b) : a == b)
  );
  const userId = useAuth().user?.uid ?? "";

  const uids = useMemo(() => (campaignId ? gmIds : [userId]), [gmIds, userId]);

  const setMoves = useCharacterSheetStore((store) => store.setCustomMoves);

  const { error } = useSnackbar();

  useEffect(() => {
    console.debug(gmIds);
  }, [gmIds]);

  useEffect(() => {
    console.debug("LISTENING TO CUSTOM MOVES");
    let unsubscribes: Unsubscribe[] = uids.map((uid) =>
      listenToCustomMoves(
        uid,
        (moves) => {
          setMoves(uid, moves);
        },
        (err) => {
          console.error(err);
          const errorMessage = getErrorMessage(
            error,
            "Failed to retrieve custom moves"
          );
          error(errorMessage);
        }
      )
    );

    return () => {
      unsubscribes.forEach((unsubscribe) => unsubscribe());
    };
  }, [uids]);
}
