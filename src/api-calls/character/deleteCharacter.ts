import { removeCharacterFromCampaign } from "api/campaign/removeCharacterFromCampaign";
import { UserNotLoggedInException } from "api/error/UserNotLoggedInException";
import { deleteDoc } from "firebase/firestore";
import { ApiFunction, useApiState } from "hooks/useApiState";
import { firebaseAuth } from "../../config/firebase.config";
// import { getCharacterAssetDoc } from "./assets/_getRef";
// import { getCharacter } from "./getCharacter";
// import { deleteCharacterNotes } from "./notes/deleteCharacterNotes";
// import { getCharacterTracksDoc } from "./tracks/_getRef";
import { getCharacterDoc } from "./_getRef";
import { createApiFunction } from "api-calls/createApiFunction";

export const deleteCharacter = createApiFunction<
  { characterId: string; campaignId?: string },
  void
>((params) => {
  return new Promise(async (resolve, reject) => {
    const { characterId, campaignId } = params;

    try {
      reject("Because I can");
      // const campaignId = (await getCharacter({ uid, characterId })).campaignId;
      // if (campaignId) {
      //   await removeCharacterFromCampaign({ campaignId, characterId });
      // }

      // const promises: Promise<any>[] = [];

      // promises.push(deleteDoc(getCharacterAssetDoc(uid, characterId)));
      // promises.push(deleteDoc(getCharacterTracksDoc(uid, characterId)));
      // promises.push(deleteDoc(getCharacterDoc(uid, characterId)));
      // promises.push(deleteCharacterNotes(uid, characterId));

      // await Promise.all(promises);
      resolve();
      return;
    } catch (e) {
      console.error(e);
      reject(e);
      return;
    }
  });
}, "Failed to delete character.");

export function useDeleteCharacter() {
  const { call, loading, error } = useApiState(deleteCharacter);

  return {
    deleteCharacter: call,
    loading,
    error,
  };
}
