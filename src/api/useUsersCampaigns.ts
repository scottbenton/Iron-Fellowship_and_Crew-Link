import { onSnapshot, query, Unsubscribe, where } from "firebase/firestore";
import { useEffect } from "react";
import { firebaseAuth } from "../config/firebase.config";
import { getCampaignCollection } from "../lib/firebase.lib";
import { useCampaignStore } from "../stores/campaigns.store";

export function useUsersCampaigns() {
  const setCampaign = useCampaignStore((state) => state.setCampaign);
  const removeCampaign = useCampaignStore((state) => state.removeCampaign);

  const uid = firebaseAuth.currentUser?.uid;
  useEffect(() => {
    let unsubscribe: Unsubscribe;

    if (uid) {
      const campaignsQuery = query(
        getCampaignCollection(),
        where("users", "array-contains", uid)
      );

      unsubscribe = onSnapshot(campaignsQuery, (snapshot) => {
        snapshot.docChanges().forEach((change) => {
          if (change.type === "removed") {
            removeCampaign(change.doc.id);
          } else {
            setCampaign(change.doc.id, change.doc.data());
          }
        });
      });
    }

    return () => {
      unsubscribe && unsubscribe();
    };
  }, [uid]);
}
