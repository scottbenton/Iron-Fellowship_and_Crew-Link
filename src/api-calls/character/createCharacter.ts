import { UserNotLoggedInException } from "api/error/UserNotLoggedInException";
import { addDoc, setDoc } from "firebase/firestore";
import { encodeDataswornId } from "functions/dataswornIdEncoder";
import { firebaseAuth } from "config/firebase.config";
import {
  healthTrack,
  momentumTrack,
  spiritTrack,
  supplyTrack,
} from "data/defaultTracks";
import { ApiFunction, useApiState } from "hooks/useApiState";
import { StoredAsset } from "types/Asset.type";
import { CharacterDocument, StatsMap } from "types/Character.type";
import { getCharacterAssetCollection } from "./assets/_getRef";
import { getUsersCharacterCollection } from "./_getRef";
import { createApiFunction } from "api-calls/createApiFunction";

export const createCharacter = createApiFunction<
  {
    uid: string;
    name: string;
    stats: StatsMap;
    assets: [StoredAsset, StoredAsset, StoredAsset];
  },
  string
>((params) => {
  return new Promise((resolve, reject) => {
    const { uid, name, stats, assets } = params;
    const character: CharacterDocument = {
      uid: uid,
      name: name,
      stats: stats,
      health: healthTrack.startingValue,
      spirit: spiritTrack.startingValue,
      supply: supplyTrack.startingValue,
      momentum: momentumTrack.startingValue,
    };

    addDoc(getUsersCharacterCollection(uid), character)
      .then((doc) => {
        const id = doc.id;
        const assetPromises = assets.map((asset) =>
          addDoc(getCharacterAssetCollection(uid, id), asset)
        );
        Promise.all(assetPromises)
          .then(() => {
            resolve(id);
          })
          .catch(() => {
            resolve(id);
          });
      })
      .catch((error) => {
        reject(error);
      });
  });
}, "Failed to create your character");

export function useCreateCharacter() {
  const { call, loading, error } = useApiState(createCharacter);

  return {
    createCharacter: call,
    loading,
    error,
  };
}
