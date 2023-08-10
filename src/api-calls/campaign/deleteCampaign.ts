import { CampaignNotFoundException } from "api/error/CampaignNotFoundException";
import { deleteDoc, deleteField, updateDoc } from "firebase/firestore";
import { getCharacterDoc } from "../character/_getRef";
// import { deleteCampaignNotes } from "./notes/deleteCampaignNotes";
// import { getSharedCampaignTracksDoc } from "./tracks/_getRef";
import { getCampaignDoc } from "./_getRef";
import { createApiFunction } from "api-calls/createApiFunction";

export const deleteCampaign = createApiFunction<
  { campaignId: string; characterIds: string[] },
  void
>((params) => {
  const { campaignId, characterIds } = params;

  return new Promise(async (resolve, reject) => {
    if (!campaignId) {
      reject(new CampaignNotFoundException());
      return;
    }

    try {
      const characterPromises = characterIds.map((characterId) => {
        return updateDoc(getCharacterDoc(characterId), {
          campaignId: deleteField(),
        });
      });

      await Promise.all(characterPromises);
      resolve();
    } catch (e) {
      reject(e);
    }

    try {
      const campaignDeletePromise = deleteDoc(getCampaignDoc(campaignId));
      // const campaignTrackDeletePromise = deleteDoc(
      //   getSharedCampaignTracksDoc(campaignId)
      // );
      // const campaignNotesDeletePromise = deleteCampaignNotes(campaignId);

      await Promise.all([
        campaignDeletePromise,
        // campaignTrackDeletePromise,
        // campaignNotesDeletePromise,
      ]);
      resolve();
    } catch (e) {
      reject(e);
    }
  });
}, "Failed to delete campaign.");
