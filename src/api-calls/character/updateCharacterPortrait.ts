import { updateDoc } from "firebase/firestore";
import { uploadImage } from "lib/storage.lib";
import {
  constructCharacterPortraitFolderPath,
  getCharacterDoc,
} from "./_getRef";
import { createApiFunction } from "api-calls/createApiFunction";
import { removeCharacterPortrait } from "./removeCharacterPortrait";

export const updateCharacterPortrait = createApiFunction<
  {
    uid: string;
    characterId: string;
    oldPortraitFilename?: string;
    portrait?: File;
    scale: number;
    position: { x: number; y: number };
  },
  void
>((params) => {
  const { uid, characterId, oldPortraitFilename, portrait, scale, position } =
    params;

  return new Promise(async (resolve, reject) => {
    try {
      if (oldPortraitFilename) {
        await removeCharacterPortrait({
          uid,
          characterId,
          oldPortraitFilename,
        });
      }
    } catch (e) {
      reject(e);
      return;
    }
    try {
      if (portrait) {
        await uploadImage(
          constructCharacterPortraitFolderPath(uid, characterId),
          portrait
        );
      }
    } catch (e) {
      reject(e);
      return;
    }

    updateDoc(
      getCharacterDoc(characterId),
      portrait
        ? {
            profileImage: {
              filename: portrait.name,
              position,
              scale,
            },
          }
        : {
            "profileImage.position": position,
            "profileImage.scale": scale,
          }
    )
      .then(() => {
        resolve();
      })
      .catch((e) => {
        reject(e);
      });
  });
}, "Failed to update character portrait");
