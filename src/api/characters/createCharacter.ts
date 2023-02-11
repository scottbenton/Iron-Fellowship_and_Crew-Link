import { UserNotLoggedInException } from "api/error/UserNotLoggedInException";
import { addDoc, setDoc } from "firebase/firestore";
import { firebaseAuth } from "../../config/firebase.config";
import {
  healthTrack,
  momentumTrack,
  spiritTrack,
  supplyTrack,
} from "../../data/defaultTracks";
import { ApiFunction, useApiState } from "../../hooks/useApiState";
import {
  getCharacterAssetDoc,
  getUsersCharacterCollection,
} from "../../lib/firebase.lib";
import { StoredAsset } from "../../types/Asset.type";
import { CharacterDocument, StatsMap } from "../../types/Character.type";

export const createCharacter: ApiFunction<
  {
    name: string;
    stats: StatsMap;
    assets: [StoredAsset, StoredAsset, StoredAsset];
  },
  string
> = function (params) {
  return new Promise((resolve, reject) => {
    const { name, stats, assets } = params;
    const uid = firebaseAuth.currentUser?.uid;
    if (!uid) {
      throw new UserNotLoggedInException();
    }
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
  });
};

export function useCreateCharacter() {
  const { call, loading, error } = useApiState(createCharacter);

  return {
    createCharacter: call,
    loading,
    error,
  };
}
