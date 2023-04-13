import { firebaseAuth } from "config/firebase.config";
import { useCampaignGMScreenStore } from "features/campaign-gm-screen/campaignGMScreen.store";
import { useCharacterSheetStore } from "features/character-sheet/characterSheet.store";
import { onSnapshot, setDoc, Unsubscribe } from "firebase/firestore";
import { getErrorMessage } from "functions/getErrorMessage";
import { useAuth } from "providers/AuthProvider";
import { useSnackbar } from "hooks/useSnackbar";
import { useEffect } from "react";
import { useCampaignStore } from "stores/campaigns.store";
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
  const uid = useAuth().user?.uid;
  const setOracles = useCampaignGMScreenStore(
    (store) => store.setCustomOracles
  );

  const { error } = useSnackbar();

  useEffect(() => {
    let unsubscribe: Unsubscribe;

    if (uid) {
      unsubscribe = listenToCustomOracles(uid, setOracles, (err) => {
        console.error(err);
        const errorMessage = getErrorMessage(
          error,
          "Failed to retrieve custom oracles"
        );
        error(errorMessage);
      });
    }

    return () => {
      unsubscribe && unsubscribe();
    };
  }, [uid]);
}

export function useCharacterSheetListenToCustomOracles() {
  const campaignId = useCharacterSheetStore((store) => store.campaignId);
  const gmUid = useCampaignStore((store) =>
    campaignId ? store.campaigns[campaignId]?.gmId : undefined
  );
  const userId = useAuth().user?.uid;

  const uid = campaignId ? gmUid : userId;

  const setOracles = useCharacterSheetStore((store) => store.setCustomOracles);

  const { error } = useSnackbar();

  useEffect(() => {
    let unsubscribe: Unsubscribe;

    if (uid) {
      unsubscribe = listenToCustomOracles(uid, setOracles, (err) => {
        console.error(err);
        const errorMessage = getErrorMessage(
          error,
          "Failed to retrieve custom oracles"
        );
        error(errorMessage);
      });
    }

    return () => {
      unsubscribe && unsubscribe();
    };
  }, [uid]);
}
