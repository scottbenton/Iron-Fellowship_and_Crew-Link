import { updateDoc } from "firebase/firestore";
import { uploadImage } from "lib/storage.lib";
import {
  constructCharacterPortraitFolderPath,
  getCharacterDoc,
} from "./_getRef";
import { createApiFunction } from "api-calls/createApiFunction";

export const updateCharacterPortrait = createApiFunction<
  {
    uid: string;
    characterId: string;
    portrait?: File;
    scale: number;
    position: { x: number; y: number };
  },
  void
>((params) => {
  const { uid, characterId, portrait, scale, position } = params;

  return new Promise(async (resolve, reject) => {
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
