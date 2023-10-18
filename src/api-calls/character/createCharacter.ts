import { addDoc } from "firebase/firestore";
import {
  healthTrack,
  momentumTrack,
  spiritTrack,
  supplyTrack,
} from "data/defaultTracks";
import { StoredAsset } from "types/Asset.type";
import { CharacterDocument, StatsMap } from "types/Character.type";
import { getCharacterAssetCollection } from "../assets/_getRef";
import { getCharacterCollection } from "./_getRef";
import { createApiFunction } from "api-calls/createApiFunction";

export const createCharacter = createApiFunction<
  {
    uid: string;
    name: string;
    stats: StatsMap;
    assets: StoredAsset[];
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

    addDoc(getCharacterCollection(), character)
      .then((doc) => {
        const id = doc.id;
        const assetPromises = assets.map((asset) =>
          addDoc(getCharacterAssetCollection(id), asset)
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
