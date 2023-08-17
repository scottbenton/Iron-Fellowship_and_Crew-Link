import { onSnapshot, query, where } from "firebase/firestore";
import { StoredCampaign } from "types/Campaign.type";
import { getCampaignCollection } from "./_getRef";

export function listenToUsersCampaigns(
  uid: string,
  dataHandler: {
    onDocChange: (id: string, data: StoredCampaign) => void;
    onDocRemove: (id: string) => void;
    onLoaded: () => void;
  },
  onError: (error: any) => void
) {
  const campaignsQuery = query(
    getCampaignCollection(),
    where("users", "array-contains", uid)
  );
  return onSnapshot(
    campaignsQuery,
    (snapshot) => {
      snapshot.docChanges().forEach((change) => {
        if (change.type === "removed") {
          dataHandler.onDocRemove(change.doc.id);
        } else {
          dataHandler.onDocChange(change.doc.id, change.doc.data());
        }
      });
      dataHandler.onLoaded();
    },
    (error) => onError(error)
  );
}
