import { CampaignNotFoundException } from "api/error/CampaignNotFoundException";
import { deleteDoc, deleteField, updateDoc } from "firebase/firestore";
import { ApiFunction, useApiState } from "hooks/useApiState";
import { getCharacterDoc } from "../characters/_getRef";
import { getCampaignCustomMovesDoc } from "./customMoves/_getRef";
import { deleteCampaignNotes } from "./notes/deleteCampaignNotes";
import { getSharedCampaignTracksDoc } from "./tracks/_getRef";
import { getCampaignDoc } from "./_getRef";

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

    try {
      const campaignDeletePromise = deleteDoc(getCampaignDoc(campaignId));
      const campaignTrackDeletePromise = deleteDoc(
        getSharedCampaignTracksDoc(campaignId)
      );
      const campaignNotesDeletePromise = deleteCampaignNotes(campaignId);
      const campaignCustomMovesDeletePromise = deleteDoc(
        getCampaignCustomMovesDoc(campaignId)
      );

      await Promise.all([
        campaignDeletePromise,
        campaignTrackDeletePromise,
        campaignNotesDeletePromise,
        campaignCustomMovesDeletePromise,
      ]);
      resolve(true);
    } catch {
      reject("Failed to delete campaign");
    }
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
