import { createApiFunction } from "api-calls/createApiFunction";
import { deleteImage } from "lib/storage.lib";
import { constructCharacterPortraitFolderPath } from "./_getRef";
import { updateCharacter } from "./updateCharacter";
import { deleteField } from "firebase/firestore";

export const removeCharacterPortrait = createApiFunction<
  {
    uid: string;
    characterId: string;
    oldPortraitFilename: string;
  },
  void
>((params) => {
  const { uid, characterId, oldPortraitFilename } = params;

  return new Promise((resolve, reject) => {
    updateCharacter({
      characterId,
      character: {
        profileImage: deleteField() as unknown as undefined,
      },
    })
      .then(() => {
        deleteImage(
          constructCharacterPortraitFolderPath(uid, characterId),
          oldPortraitFilename
        )
          .then(() => {
            resolve();
          })
          .catch((e) => {
            reject(e);
          });
      })
      .catch((e) => reject(e));
  });
}, "Failed to remove old character portrait");
