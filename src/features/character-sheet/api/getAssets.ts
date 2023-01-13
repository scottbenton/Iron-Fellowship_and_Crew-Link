import { onSnapshot } from "firebase/firestore";
import { firebaseAuth } from "../../../config/firebase.config";
import { getCharacterAssetDoc } from "../../../lib/firebase.lib";
import { StoredAsset } from "../../../types/Asset.type";

export function getAssets(
  characterId: string,
  onAssets: (assets: StoredAsset[]) => void,
  onError: (errorMessage: string) => void
) {
  const uid = firebaseAuth.currentUser?.uid;

  if (uid) {
    return onSnapshot(
      getCharacterAssetDoc(uid, characterId),
      (snapshot) => {
        const assets = snapshot.data()?.assets;
        if (assets) {
          onAssets(assets);
        } else {
          onError("No assets found");
        }
      },
      (error) => {
        console.error(error);
        onError("Error fetching assets");
      }
    );
  } else {
    onError("No user found");
  }
}
