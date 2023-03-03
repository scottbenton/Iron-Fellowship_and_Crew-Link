import { onSnapshot, query, Unsubscribe } from "firebase/firestore";
import { getErrorMessage } from "functions/getErrorMessage";
import { useSnackbar } from "hooks/useSnackbar";
import { useEffect } from "react";
import { useSettingsStore } from "stores/settings.store";
import { Settings } from "types/Settings.type";
import { getCampaignCustomMovesDoc } from "./_getRef";

export function listenToCampaignCustomMoves(
  campaignId: string,
  dataHandler: {
    onDocChange: (id: string, data: Settings) => void;
    onLoaded: () => void;
  },
  onError: (error: any) => void
) {
  return onSnapshot(
    getCampaignCustomMovesDoc(campaignId),
    (snapshot) => {
      if (snapshot.exists()) {
        dataHandler.onDocChange(campaignId, snapshot.data());
      }
      dataHandler.onLoaded();
    },
    (error) => onError(error)
  );
}

export function useListenToCampaignCustomMoves(campaignId: string) {
  const setSettings = useSettingsStore((state) => state.setSettings);
  const setLoading = useSettingsStore((state) => state.setLoading);

  const { error } = useSnackbar();

  useEffect(() => {
    let unsubscribe: Unsubscribe;

    listenToCampaignCustomMoves(
      campaignId,
      {
        onDocChange: (id, doc) => setSettings(id, doc),
        onLoaded: () => setLoading(false),
      },
      (err) => {
        console.error(err);
        const errorMessage = getErrorMessage(
          error,
          "Failed to retrieve campaign settings"
        );
        error(errorMessage);
      }
    );

    return () => {
      unsubscribe && unsubscribe();
    };
  }, [campaignId]);
}
