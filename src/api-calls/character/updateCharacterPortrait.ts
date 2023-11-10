import { updateDoc } from "firebase/firestore";
import {
  MAX_FILE_SIZE,
  MAX_FILE_SIZE_LABEL,
  replaceImage,
  uploadImage,
} from "lib/storage.lib";
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
      if (portrait) {
        await replaceImage(
          constructCharacterPortraitFolderPath(uid, characterId),
          oldPortraitFilename,
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
