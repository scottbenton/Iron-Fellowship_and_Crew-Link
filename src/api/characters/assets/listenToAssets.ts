import { onSnapshot, Unsubscribe } from "firebase/firestore";
import { useEffect } from "react";
import { getErrorMessage } from "functions/getErrorMessage";
import { useAuth } from "hooks/useAuth";
import { useSnackbar } from "hooks/useSnackbar";
import { getCharacterAssetDoc } from "lib/firebase.lib";
import { StoredAsset } from "types/Asset.type";
import { useCharacterSheetStore } from "features/character-sheet/characterSheet.store";

export function listenToAssets(
  uid: string,
  characterId: string,
  onAssets: (assets: StoredAsset[]) => void,
  onError: (error: any) => void
) {
  return onSnapshot(
    getCharacterAssetDoc(uid, characterId),
    (snapshot) => {
      const data = snapshot.data();
      const assets = data?.assets;
      const assetOrder = data?.assetOrder;

      if (assets && assetOrder) {
        const orderedAssets = assetOrder.map((assetId) => assets[assetId]);
        onAssets(orderedAssets);
      } else {
        onError(new Error("No Assets found."));
      }
    },
    (error) => onError(error)
  );
}

// Unopinionated hook for fetching character assets
export function useListenToAssets(
  uid: string | undefined,
  characterId: string | undefined,
  setAssets: (assets: StoredAsset[]) => void
) {
  const { error } = useSnackbar();

  useEffect(() => {
    let unsubscribe: Unsubscribe;

    if (uid && characterId) {
      listenToAssets(
        uid,
        characterId,
        (assets) => setAssets(assets),
        (err) => {
          console.error(err);
          const errorMessage = getErrorMessage(
            error,
            "Failed to load campaigns"
          );
          error(errorMessage);
        }
      );
    } else {
      setAssets([]);
    }

    return () => {
      unsubscribe && unsubscribe();
    };
  }, [uid, characterId]);
}

// Connects to the character sheet store
export function useListenToCharacterSheetAssets() {
  const uid = useAuth().user?.uid;
  const campaignId = useCharacterSheetStore((store) => store.characterId);
  const setAssets = useCharacterSheetStore((store) => store.setAssets);

  return useListenToAssets(uid, campaignId, setAssets);
}
