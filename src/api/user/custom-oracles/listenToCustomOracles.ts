import { firebaseAuth } from "config/firebase.config";
import { useCampaignGMScreenStore } from "pages/Campaign/CampaignGMScreenPage/campaignGMScreen.store";
import { useCharacterSheetStore } from "pages/Character/CharacterSheetPage/characterSheet.store";
import { onSnapshot, setDoc, Unsubscribe } from "firebase/firestore";
import { getErrorMessage } from "functions/getErrorMessage";
import { useAuth } from "providers/AuthProvider";
import { useSnackbar } from "hooks/useSnackbar";
import { useEffect } from "react";
import { StoredOracle } from "types/Oracles.type";
import { getUsersCustomOracleDoc } from "./_getRef";

export function listenToCustomOracles(
  uid: string,
  onCustomOracles: (oracles: StoredOracle[]) => void,
  onError: (error: any) => void
) {
  return onSnapshot(
    getUsersCustomOracleDoc(uid),
    (snapshot) => {
      if (snapshot.exists()) {
        const data = snapshot.data();
        onCustomOracles(
          data.oracleOrder.map((oracleId) => data.oracles[oracleId])
        );
      } else if (uid === firebaseAuth.currentUser?.uid) {
        setDoc(getUsersCustomOracleDoc(uid), {
          oracles: {},
          oracleOrder: [],
        });
      } else {
        onCustomOracles([]);
      }
    },
    (error) => onError(error)
  );
}

export function useCampaignGMScreenListenToCustomOracles() {
  const gmIds = useCampaignGMScreenStore(
    (store) => store.campaign?.gmIds ?? [],
    (a, b) => (a && b ? JSON.stringify(a) === JSON.stringify(b) : a == b)
  );
  const setOracles = useCampaignGMScreenStore(
    (store) => store.setCustomOracles
  );

  const { error } = useSnackbar();

  useEffect(() => {
    let unsubscribes: Unsubscribe[] = gmIds.map((gmId) =>
      listenToCustomOracles(
        gmId,
        (oracles) => setOracles(gmId, oracles),
        (err) => {
          console.error(err);
          const errorMessage = getErrorMessage(
            error,
            "Failed to retrieve custom oracles"
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

export function useCharacterSheetListenToCustomOracles() {
  const campaignId = useCharacterSheetStore((store) => store.campaignId);
  const gmIds = useCharacterSheetStore((store) => store.campaign?.gmIds ?? []);
  const userId = useAuth().user?.uid ?? "";

  const uids = campaignId ? gmIds : [userId];

  const setOracles = useCharacterSheetStore((store) => store.setCustomOracles);

  const { error } = useSnackbar();

  useEffect(() => {
    let unsubscribes: Unsubscribe[] = uids.map((uid) =>
      listenToCustomOracles(
        uid,
        (oracles) => setOracles(uid, oracles),
        (err) => {
          console.error(err);
          const errorMessage = getErrorMessage(
            error,
            "Failed to retrieve custom oracles"
          );
          error(errorMessage);
        }
      )
    );

    return () => {
      unsubscribes.map((unsubscribe) => unsubscribe());
    };
  }, [uids]);
}
