import { UserNotLoggedInException } from "api/error/UserNotLoggedInException";
import { arrayUnion, updateDoc } from "firebase/firestore";
import { firebaseAuth } from "../../config/firebase.config";
import { ApiFunction, useApiState } from "../../hooks/useApiState";
import { getCharacterDoc } from "../characters/_getRef";
import { getCampaignDoc } from "./_getRef";

export const addCharacterToCampaign: ApiFunction<
  { characterId: string; campaignId: string },
  boolean
> = function (params) {
  return new Promise((resolve, reject) => {
    const { characterId, campaignId } = params;

    const uid = firebaseAuth.currentUser?.uid;

    if (!uid) {
      reject(new UserNotLoggedInException());
      return;
    }

    let updateCampaign = updateDoc(getCampaignDoc(campaignId), {
      characters: arrayUnion({ uid, characterId }),
    });
    let updateCharacter = updateDoc(getCharacterDoc(uid, characterId), {
      campaignId: campaignId,
    });

    Promise.all([updateCampaign, updateCharacter])
      .then(() => {
        resolve(true);
      })
      .catch((e) => {
        console.error(e);
        reject(new Error("Error adding character to campaign"));
      });
  });
};

export function useAddCharacterToCampaignMutation() {
  const { loading, error, call } = useApiState(addCharacterToCampaign);
  return {
    loading,
    error,
    addCharacterToCampaign: call,
  };
}
