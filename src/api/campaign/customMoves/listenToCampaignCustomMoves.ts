import { useCampaignGMScreenStore } from "features/campaign-gm-screen/campaignGMScreen.store";
import { useCharacterSheetStore } from "features/character-sheet/characterSheet.store";
import { onSnapshot, setDoc, Unsubscribe } from "firebase/firestore";
import { getErrorMessage } from "functions/getErrorMessage";
import { useSnackbar } from "hooks/useSnackbar";
import { useEffect } from "react";
import { StoredMove } from "types/Moves.type";
import { getCampaignCustomMovesDoc } from "./_getRef";

export function listenToCampaignCustomMoves(
  campaignId: string,
  onCustomMoves: (moves: StoredMove[]) => void,
  onError: (error: any) => void
) {
  return onSnapshot(
    getCampaignCustomMovesDoc(campaignId),
    (snapshot) => {
      if (snapshot.exists()) {
        const data = snapshot.data();
        onCustomMoves(data.moveOrder.map((moveId) => data.moves[moveId]));
      } else {
        setDoc(getCampaignCustomMovesDoc(campaignId), {
          moves: {},
          moveOrder: [],
        });
      }
    },
    (error) => onError(error)
  );
}

export function useCampaignGMScreenListenToCampaignCustomMoves() {
  const campaignId = useCampaignGMScreenStore((store) => store.campaignId);
  const setMoves = useCampaignGMScreenStore((store) => store.setCustomMoves);

  const { error } = useSnackbar();

  useEffect(() => {
    let unsubscribe: Unsubscribe;

    if (campaignId) {
      unsubscribe = listenToCampaignCustomMoves(campaignId, setMoves, (err) => {
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
  }, [campaignId]);
}

export function useCharacterSheetListenToCampaignCustomMoves() {
  const campaignId = useCharacterSheetStore((store) => store.campaignId);
  const setMoves = useCharacterSheetStore((store) => store.setCustomMoves);

  const { error } = useSnackbar();

  useEffect(() => {
    let unsubscribe: Unsubscribe;

    if (campaignId) {
      unsubscribe = listenToCampaignCustomMoves(campaignId, setMoves, (err) => {
        console.error(err);
        const errorMessage = getErrorMessage(
          error,
          "Failed to retrieve campaign settings"
        );
        error(errorMessage);
      });
    }

    return () => {
      unsubscribe && unsubscribe();
    };
  }, [campaignId]);
}
