import { CampaignNotFoundException } from "api/error/CampaignNotFoundException";
import { deleteDoc, deleteField, updateDoc } from "firebase/firestore";
import { ApiFunction, useApiState } from "hooks/useApiState";
import { getCampaignDoc, getCharacterDoc } from "lib/firebase.lib";

export const deleteCampaign: ApiFunction<
  { campaignId?: string; characters: { uid: string; characterId: string }[] },
  boolean
> = function (params) {
  const { campaignId, characters } = params;

  return new Promise(async (resolve, reject) => {
    if (!campaignId) {
      reject(new CampaignNotFoundException());
      return;
    }

    try {
      const characterPromises = characters.map((character) => {
        return updateDoc(
          getCharacterDoc(character.uid, character.characterId),
          {
            campaignId: deleteField(),
          }
        );
      });

      await Promise.all(characterPromises);
      resolve(true);
    } catch (e) {
      reject("Failed to update characters");
      return;
    }
    deleteDoc(getCampaignDoc(campaignId))
      .then(() => {
        resolve(true);
      })
      .catch((e) => {
        reject("Failed to delete campaign");
      });
  });
};

export function useDeleteCampaign() {
  const { call, loading, error } = useApiState(deleteCampaign);

  return {
    deleteCampaign: call,
    loading,
    error,
  };
}
