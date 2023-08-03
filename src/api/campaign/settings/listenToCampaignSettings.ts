import { useCampaignGMScreenStore } from "pages/Campaign/CampaignGMScreenPage/campaignGMScreen.store";
import { useCharacterSheetStore } from "pages/Character/CharacterSheetPage/characterSheet.store";
import { onSnapshot, Unsubscribe } from "firebase/firestore";
import { getErrorMessage } from "functions/getErrorMessage";
import { useSnackbar } from "providers/SnackbarProvider/useSnackbar";
import { useEffect } from "react";
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
      onSettings({
        ...snapshot.data(),
        hiddenCustomMoveIds: [],
        hiddenCustomOraclesIds: [],
      });
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
