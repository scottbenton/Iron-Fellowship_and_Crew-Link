import { onSnapshot, query, where } from "firebase/firestore";
import { HomebrewCollectionDocument } from "types/homebrew/HomebrewCollection.type";
import { getHomebrewCollection } from "./_getRef";

export function listenToHomebrewCollections(
  uid: string,
  updateCollection: (
    collectionId: string,
    collection: HomebrewCollectionDocument
  ) => void,
  removeCollection: (collectionId: string) => void,
  onError: (error: unknown) => void,
  onLoaded: () => void
) {
  const homebrewQuery = query(
    getHomebrewCollection(),
    where("editors", "array-contains", uid)
  );
  return onSnapshot(
    homebrewQuery,
    (snapshot) => {
      snapshot.docChanges().forEach((change) => {
        if (change.type === "removed") {
          removeCollection(change.doc.id);
        } else {
          updateCollection(change.doc.id, change.doc.data());
        }
      });
      if (snapshot.docChanges.length === 0) {
        onLoaded();
      }
    },
    (error) => {
      console.error(error);
      onError(error);
    }
  );
}
