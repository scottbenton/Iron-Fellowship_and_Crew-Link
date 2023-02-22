import { onSnapshot, Unsubscribe } from "firebase/firestore";
import { getErrorMessage } from "functions/getErrorMessage";
import { useSnackbar } from "hooks/useSnackbar";
import { useEffect, useState } from "react";
import { Move } from "types/Moves.type";
import { getCampaignCustomMoveDoc } from "./_getRef";

export function listenToCampaignCustomMoves(
  campaignId: string,
  onMoves: (moves: Move[]) => void,
  onError: (error: any) => void
) {
  return onSnapshot(
    getCampaignCustomMoveDoc(campaignId),
    (snapshot) => {
      const data = snapshot.data();

      onMoves(data?.moves);
    },
    (error) => onError(error)
  );
}

export function useListenToCampaignCustomMoves(campaignId: string) {
  const [moves, setMoves] = useState<Move[]>();

  const { error } = useSnackbar();

  useEffect(() => {
    let unsubscribe: Unsubscribe;

    listenToCampaignCustomMoves(
      campaignId,
      (newMoves) => setMoves(newMoves),
      (err) => {
        console.error(err);
        const errorMessage = getErrorMessage(
          error,
          "Failed to retrieve campaign custom moves"
        );
        error(errorMessage);
      }
    );

    return () => {
      unsubscribe && unsubscribe();
    };
  }, [campaignId]);

  return { moves };
}
