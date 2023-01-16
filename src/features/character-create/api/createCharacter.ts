import { addDoc, collection, setDoc } from "firebase/firestore";
import { firebaseAuth, firestore } from "../../../config/firebase.config";
import {
  healthTrack,
  momentumTrack,
  spiritTrack,
  supplyTrack,
} from "../../../data/defaultTracks";
import {
  getCharacterAssetDoc,
  getUsersCharacterCollection,
} from "../../../lib/firebase.lib";
import { StoredAsset } from "../../../types/Asset.type";
import { CharacterDocument, StatsMap } from "../../../types/Character.type";

export function createFirebaseCharacter(
  name: string,
  stats: StatsMap,
  assets: [StoredAsset, StoredAsset, StoredAsset]
): Promise<string> {
  return new Promise((resolve, reject) => {
    const uid = firebaseAuth.currentUser?.uid;
    if (uid) {
      const character: CharacterDocument = {
        name: name,
        stats: stats,
        health: healthTrack.startingValue,
        spirit: spiritTrack.startingValue,
        supply: supplyTrack.startingValue,
        momentum: momentumTrack.startingValue,
      };

      const assetOrder: string[] = [];
      let assetsMap: { [key: string]: StoredAsset } = {};
      assets.map((asset) => {
        assetOrder.push(asset.id);
        assetsMap[asset.id] = asset;
      });

      addDoc(getUsersCharacterCollection(uid), character)
        .then((doc) => {
          const id = doc.id;
          setDoc(getCharacterAssetDoc(uid, id), {
            assetOrder,
            assets: assetsMap,
          })
            .then(() => {
              resolve(id);
            })
            .catch(() => {
              resolve(id);
            });
        })
        .catch((error) => {
          console.error(error);
          reject("Error adding document to database");
        });
    } else {
      reject("User could not be found.");
    }
  });
}
