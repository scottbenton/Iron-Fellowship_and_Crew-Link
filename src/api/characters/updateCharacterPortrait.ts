import { CharacterNotFoundException } from "api/error/CharacterNotFoundException";
import { UserNotLoggedInException } from "api/error/UserNotLoggedInException";
import { useCharacterSheetStore } from "pages/Character/CharacterSheetPage/characterSheet.store";
import { updateDoc } from "firebase/firestore";
import { ApiFunction, useApiState } from "hooks/useApiState";
import { useAuth } from "providers/AuthProvider";
import { uploadImage } from "lib/storage.lib";
import { constructCharacterDocPath, getCharacterDoc } from "./_getRef";

export const updateCharacterPortrait: ApiFunction<
  {
    uid?: string;
    characterId?: string;
    portrait?: File;
    scale: number;
    position: { x: number; y: number };
  },
  boolean
> = (params) => {
  const { uid, characterId, portrait, scale, position } = params;

  return new Promise(async (resolve, reject) => {
    if (!uid) {
      reject(new UserNotLoggedInException());
      return;
    }
    if (!characterId) {
      reject(new CharacterNotFoundException());
      return;
    }
    try {
      if (portrait) {
        await uploadImage(
          constructCharacterDocPath(uid, characterId),
          portrait
        );
      }
    } catch (e) {
      reject("Failed to upload character portrait");
      return;
    }

    updateDoc(
      getCharacterDoc(uid, characterId),
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
        resolve(true);
      })
      .catch((e) => {
        console.error(e);
        reject("Failed to update character document");
      });
  });
};

export function useUpdateCharacterPortrait() {
  const { call, loading, error } = useApiState(updateCharacterPortrait);
  return {
    updateCharacterPortrait: call,
    loading,
    error,
  };
}

export function useCharacterSheetUpdateCharacterPortrait() {
  const uid = useAuth().user?.uid;
  const characterId = useCharacterSheetStore((store) => store.characterId);

  const { updateCharacterPortrait, loading, error } =
    useUpdateCharacterPortrait();

  return {
    updateCharacterPortrait: (params: {
      portrait?: File;
      scale: number;
      position: { x: number; y: number };
    }) => updateCharacterPortrait({ uid, characterId, ...params }),
    loading,
    error,
  };
}
