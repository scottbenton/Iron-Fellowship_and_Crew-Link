import { onSnapshot, query, Unsubscribe, where } from "firebase/firestore";
import { useEffect } from "react";
import { firebaseAuth } from "../../config/firebase.config";
import { getErrorMessage } from "../../functions/getErrorMessage";
import { useAuth } from "../../hooks/useAuth";
import { useSnackbar } from "../../hooks/useSnackbar";
import { getCampaignCollection } from "../../lib/firebase.lib";
import { useCampaignStore } from "../../stores/campaigns.store";
import { StoredCampaign } from "../../types/Campaign.type";

export function listenToUsersCampaigns(
  uid: string | undefined,
  dataHandler: {
    onDocChange: (id: string, data: StoredCampaign) => void;
    onDocRemove: (id: string) => void;
  },
  onError: (error: any) => void
) {
  if (uid) {
    const campaignsQuery = query(
      getCampaignCollection(),
      where("users", "array-contains", uid)
    );
    console.debug("STARTING SNAPSHOT LISTENER");
    return onSnapshot(
      campaignsQuery,
      (snapshot) => {
        console.debug("HAVE SNAPSHOT");
        console.debug(
          snapshot.docs.forEach((doc) => {
            console.debug(doc.data());
          })
        );
        snapshot.docChanges().forEach((change) => {
          console.debug(change);
          if (change.type === "removed") {
            dataHandler.onDocRemove(change.doc.id);
          } else {
            dataHandler.onDocChange(change.doc.id, change.doc.data());
          }
        });
      },
      (error) => onError(error)
    );
  }
}

export function useListenToUsersCampaigns() {
  const setCampaign = useCampaignStore((state) => state.setCampaign);
  const removeCampaign = useCampaignStore((state) => state.removeCampaign);

  const { error } = useSnackbar();

  const uid = useAuth().user?.uid;

  useEffect(() => {
    let unsubscribe: Unsubscribe;

    console.debug("LISTENING TO CAMPAIGNS");

    listenToUsersCampaigns(
      uid,
      {
        onDocChange: (id, doc) => setCampaign(id, doc),
        onDocRemove: (id) => removeCampaign(id),
      },
      (err) => {
        console.error(err);
        const errorMessage = getErrorMessage(error, "Failed to load campaigns");
        error(errorMessage);
      }
    );

    return () => {
      unsubscribe && unsubscribe();
    };
  }, [uid]);
}
