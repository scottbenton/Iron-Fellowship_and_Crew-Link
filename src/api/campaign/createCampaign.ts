import { addDoc } from "firebase/firestore";
import { firebaseAuth } from "../../config/firebase.config";
import { supplyTrack } from "../../data/defaultTracks";
import { ApiFunction, useApiState } from "../../hooks/useApiState";
import { getCampaignCollection } from "../../lib/firebase.lib";
import { StoredCampaign } from "../../types/Campaign.type";

export const createCampaign: ApiFunction<string, string> = function (
  label: string
) {
  return new Promise((resolve, reject) => {
    const uid = firebaseAuth.currentUser?.uid;

    if (!uid) {
      reject(new Error("User is not logged in."));
      return;
    }

    const storedCampaign: StoredCampaign = {
      name: label,
      users: [uid],
      characters: [],
      supply: supplyTrack.startingValue,
    };

    addDoc(getCampaignCollection(), storedCampaign)
      .then((doc) => {
        resolve(doc.id);
      })
      .catch((err) => {
        console.error(err);
        reject("Error creating campaign.");
      });
  });
};

export function useCreateCampaignMutation() {
  const {
    data,
    error,
    loading,
    call: handleCreateCampaign,
  } = useApiState(createCampaign);

  return {
    data,
    error,
    loading,
    handleCreateCampaign,
  };
}
