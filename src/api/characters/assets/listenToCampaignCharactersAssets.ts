import { Unsubscribe } from "firebase/firestore";
import { useEffect } from "react";
import { getErrorMessage } from "../../../functions/getErrorMessage";
import { useSnackbar } from "../../../hooks/useSnackbar";
import { useCampaignStore } from "../../../stores/campaigns.store";
import { useCampaignGMScreenStore } from "pages/Campaign/CampaignGMScreenPage/campaignGMScreen.store";
import { StoredAsset } from "types/Asset.type";
import { listenToAssets } from "./listenToAssets";

interface Params {
  characterIdList: { characterId: string; uid: string }[] | undefined;
  onAssetChange: (id: string, assets?: StoredAsset[]) => void;
  onError: (error: any) => void;
}

export function listenToCampaignCharacters(params: Params): Unsubscribe[] {
  const { characterIdList, onAssetChange, onError } = params;

  const unsubscribes = (characterIdList || []).map((character, index) => {
    return listenToAssets(
      character.uid,
      character.characterId,
      (assets) => onAssetChange(character.characterId, assets),
      onError
    );
  });
  return unsubscribes;
}

export function useCampaignGMScreenListenToCampaignAssets() {
  const { error } = useSnackbar();

  const campaignId = useCampaignGMScreenStore((store) => store.campaignId);
  const characters = useCampaignStore(
    (store) => store.campaigns[campaignId ?? ""]?.characters
  );

  const updateCharacterAssets = useCampaignGMScreenStore(
    (store) => store.setCharacterAssets
  );

  useEffect(() => {
    let unsubscribes = listenToCampaignCharacters({
      characterIdList: characters,
      onAssetChange: (id, assets) => {
        updateCharacterAssets(id, assets ?? []);
      },
      onError: (err) => {
        console.error(err);
        const errorMessage = getErrorMessage(
          error,
          "Failed to load character assets"
        );
        error(errorMessage);
      },
    });

    return () => {
      unsubscribes?.forEach((unsubscribe) => unsubscribe());
    };
  }, [characters]);
}
