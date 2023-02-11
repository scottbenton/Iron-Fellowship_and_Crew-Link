import { removeCharacterFromCampaign } from "api/campaign/removeCharacterFromCampaign";
import { UserNotLoggedInException } from "api/error/UserNotLoggedInException";
import { deleteDoc } from "firebase/firestore";
import { ApiFunction, useApiState } from "hooks/useApiState";
import { firebaseAuth } from "../../config/firebase.config";
import {
  getCampaignDoc,
  getCharacterAssetDoc,
  getCharacterDoc,
  getCharacterTracksDoc,
} from "../../lib/firebase.lib";
import { getCharacter } from "./getCharacter";

export const deleteCharacter: ApiFunction<string, boolean> = function (
  characterId
) {
  return new Promise(async (resolve, reject) => {
    const uid = firebaseAuth.currentUser?.uid;

    if (!uid) {
      throw new UserNotLoggedInException();
      return;
    }
    try {
      const campaignId = (await getCharacter({ uid, characterId })).campaignId;
      if (campaignId) {
        await removeCharacterFromCampaign({ campaignId, characterId });
      }

      const promises: Promise<any>[] = [];

      promises.push(deleteDoc(getCharacterAssetDoc(uid, characterId)));
      promises.push(deleteDoc(getCharacterTracksDoc(uid, characterId)));
      promises.push(deleteDoc(getCharacterDoc(uid, characterId)));

      await Promise.all(promises);
      resolve(true);
      return;
    } catch (e) {
      console.error(e);
      reject(e);
      return;
    }
  });
};

export function useDeleteCharacter() {
  const { call, loading, error } = useApiState(deleteCharacter);

  return {
    deleteCharacter: call,
    loading,
    error,
  };
}
