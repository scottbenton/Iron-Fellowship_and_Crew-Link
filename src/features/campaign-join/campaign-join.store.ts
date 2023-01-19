import { arrayUnion, getDoc, updateDoc } from "firebase/firestore";
import produce from "immer";
import create from "zustand";
import { firebaseAuth } from "../../config/firebase.config";
import { getCampaignDoc } from "../../lib/firebase.lib";
import { StoredCampaign } from "../../types/Campaign.type";

export interface CampaignJoinStore {
  campaign?: StoredCampaign;
  loading: boolean;
  error?: string;

  loadCampaign: (campaignId: string) => void;
  joinCampaign: (campaignId: string) => Promise<boolean>;
}

export const useCampaignJoinStore = create<CampaignJoinStore>()(
  (set, getState) => ({
    loading: true,

    loadCampaign: (campaignId) => {
      getDoc(getCampaignDoc(campaignId))
        .then((snapshot) => {
          const campaign = snapshot.data();

          if (campaign) {
            set(
              produce((state: CampaignJoinStore) => {
                state.campaign = campaign;
                state.loading = false;
                state.error = undefined;
              })
            );
          } else {
            set(
              produce((state: CampaignJoinStore) => {
                state.campaign = undefined;
                state.loading = false;
                state.error = "Could not find Campaign";
              })
            );
          }
        })
        .catch((err) => {
          console.error(err);
          set(
            produce((state: CampaignJoinStore) => {
              state.campaign = undefined;
              state.loading = false;
              state.error = "Error loading campaign";
            })
          );
        });
    },
    joinCampaign: (campaignId: string) =>
      new Promise<boolean>((resolve, reject) => {
        const uid = firebaseAuth.currentUser?.uid;

        if (uid) {
          updateDoc(getCampaignDoc(campaignId), {
            users: arrayUnion(uid),
          })
            .then(() => {
              resolve(true);
            })
            .catch((e) => {
              console.error(e);
              reject("Error adding user to campaign");
            });
        } else {
          reject("No user found");
        }
      }),
  })
);
