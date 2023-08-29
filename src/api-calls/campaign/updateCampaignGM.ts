import { arrayUnion, arrayRemove, updateDoc } from "firebase/firestore";
import { getCampaignDoc } from "./_getRef";
import { createApiFunction } from "api-calls/createApiFunction";
import { getWorldDoc } from "api-calls/world/_getRef";

export const updateCampaignGM = createApiFunction<
  {
    campaignId: string;
    worldId?: string;
    gmId: string;
    shouldRemove?: boolean;
  },
  void
>((params) => {
  const { campaignId, worldId, gmId, shouldRemove } = params;

  // Add user to world
  if (!shouldRemove && worldId) {
    return new Promise((resolve, reject) => {
      updateDoc(getWorldDoc(worldId), { ownerIds: arrayUnion(gmId) })
        .then(() => {
          updateDoc(
            getCampaignDoc(campaignId),
            !shouldRemove
              ? {
                  gmIds: arrayUnion(gmId),
                }
              : {
                  gmIds: arrayRemove(gmId),
                }
          )
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
    updateDoc(
      getCampaignDoc(campaignId),
      !shouldRemove
        ? {
            gmIds: arrayUnion(gmId),
          }
        : {
            gmIds: arrayRemove(gmId),
          }
    )
      .then(() => {
        resolve();
      })
      .catch((e) => {
        reject(e);
      });
  });
}, "Failed to update GM.");
