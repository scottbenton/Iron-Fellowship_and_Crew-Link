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

      console.debug(assets);

      addDoc(getUsersCharacterCollection(uid), character)
        .then((doc) => {
          const id = doc.id;
          setDoc(getCharacterAssetDoc(uid, id), { assets })
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
