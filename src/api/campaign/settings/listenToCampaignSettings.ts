import { listenToCustomMoves } from "api/user/custom-moves/listenToCustomMoves";
import { useCampaignGMScreenStore } from "features/campaign-gm-screen/campaignGMScreen.store";
import { useCharacterSheetStore } from "features/character-sheet/characterSheet.store";
import { onSnapshot, setDoc, Unsubscribe } from "firebase/firestore";
import { getErrorMessage } from "functions/getErrorMessage";
import { useAuth } from "hooks/useAuth";
import { useSnackbar } from "hooks/useSnackbar";
import { useEffect } from "react";
import { useCampaignStore } from "stores/campaigns.store";
import { CampaignSettingsDoc } from "types/Settings.type";
import { getCampaignSettingsDoc } from "./_getRef";

export function listenToCampaignSettings(
  campaignId: string,
  onSettings: (settings: CampaignSettingsDoc) => void,
  onError: (error: any) => void
) {
  return onSnapshot(
    getCampaignSettingsDoc(campaignId),
    (snapshot) => {
      if (snapshot.exists()) {
        onSettings(snapshot.data());
      } else {
        setDoc(getCampaignSettingsDoc(campaignId), {
          hiddenCustomMoveIds: [],
          hiddenCustomOraclesIds: [],
        });
      }
    },
    (error) => onError(error)
  );
}

export function useCampaignGMScreenListenToCampaignSettings() {
  const campaignId = useCampaignGMScreenStore((store) => store.campaignId);
  const setSettings = useCampaignGMScreenStore(
    (store) => store.setCampaignSettings
  );

  const { error } = useSnackbar();

  useEffect(() => {
    let unsubscribe: Unsubscribe;

    if (campaignId) {
      unsubscribe = listenToCampaignSettings(campaignId, setSettings, (err) => {
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

export function useCharacterSheetListenToCampaignSettings() {
  const campaignId = useCharacterSheetStore((store) => store.campaignId);
  const setSettings = useCharacterSheetStore(
    (store) => store.setCharacterSettings
  );

  const { error } = useSnackbar();

  useEffect(() => {
    let unsubscribe: Unsubscribe;

    if (campaignId) {
      unsubscribe = listenToCampaignSettings(campaignId, setSettings, (err) => {
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
