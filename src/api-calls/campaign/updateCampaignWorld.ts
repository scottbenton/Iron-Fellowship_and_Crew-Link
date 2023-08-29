import { arrayUnion, deleteField, updateDoc } from "firebase/firestore";
import { getCampaignDoc } from "./_getRef";
import { createApiFunction } from "api-calls/createApiFunction";
import { getWorldDoc } from "api-calls/world/_getRef";

export const updateCampaignWorld = createApiFunction<
  { campaignId: string; gmIds: string[]; worldId?: string },
  void
>((params) => {
  const { campaignId, gmIds, worldId } = params;
  if (worldId) {
    return new Promise((resolve, reject) => {
      updateDoc(getWorldDoc(worldId), {
        ownerIds: arrayUnion(...gmIds),
      })
        .then(() => {
          updateDoc(getCampaignDoc(campaignId), {
            worldId,
          })
            .then(() => {
              resolve();
            })
            .catch((e) => {
              reject(e);
            });
        })
        .catch((e) => {
          reject(e);
        });
    });
  }
  return new Promise((resolve, reject) => {
    updateDoc(getCampaignDoc(campaignId), {
      worldId: deleteField(),
    })
      .then(() => {
        resolve();
      })
      .catch((e) => {
        reject(e);
      });
  });
}, "Failed to update campaign world.");
