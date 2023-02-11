import { UserNotLoggedInException } from "api/error/UserNotLoggedInException";
import { arrayRemove, deleteField, updateDoc } from "firebase/firestore";
import { firebaseAuth } from "../../config/firebase.config";
import { ApiFunction, useApiState } from "../../hooks/useApiState";
import { getCampaignDoc, getCharacterDoc } from "../../lib/firebase.lib";

export const removeCharacterFromCampaign: ApiFunction<
  { campaignId: string; characterId: string },
  boolean | undefined
> = async function (params) {
  const { campaignId, characterId } = params;
  const uid = firebaseAuth.currentUser?.uid;

  if (!uid) {
    throw new UserNotLoggedInException();
    return;
  }

  try {
    let campaignPromise = updateDoc(getCampaignDoc(campaignId), {
      characters: arrayRemove({ characterId, uid }),
    });
    let characterPromise = updateDoc(getCharacterDoc(uid, characterId), {
      campaignId: deleteField(),
    });

    await Promise.all([campaignPromise, characterPromise]);
    return true;
  } catch (e) {
    console.error(e);
    throw new Error("Failed to remove character from campaign");
    return;
  }
};

export function useRemoveCharacterFromCampaign() {
  const { call, loading, error } = useApiState(removeCharacterFromCampaign);

  return {
    removeCharacterFromCampaign: call,
    loading,
    error,
  };
}
