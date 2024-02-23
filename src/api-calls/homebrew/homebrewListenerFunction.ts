import {
  CollectionReference,
  DocumentData,
  onSnapshot,
  query,
  where,
  Unsubscribe,
} from "firebase/firestore";

export type HomebrewListenerFunction<T> = (
  homebrewId: string,
  updateData: (data: Record<string, T>) => void,
  onError: (error: unknown) => void
) => Unsubscribe;

export function createHomebrewListenerFunction<
  T extends { collectionId: string }
>(
  collectionRef: CollectionReference<T, DocumentData>
): HomebrewListenerFunction<T> {
  return (homebrewId, updateData, onError) => {
    return onSnapshot(
      query(collectionRef, where("collectionId", "==", homebrewId)),
      (snapshot) => {
        const data: Record<string, T> = {};
        snapshot.docs.forEach((doc) => {
          data[doc.id] = doc.data();
        });
        updateData(data);
      },
      (error) => {
        console.error(error);
        onError(error);
      }
    );
  };
}
