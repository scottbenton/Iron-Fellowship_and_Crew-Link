import { onSnapshot, query, where } from "firebase/firestore";
import { CharacterDocument } from "../../types/Character.type";
import { getCharacterCollection } from "./_getRef";

export function listenToUsersCharacters(
  uid: string,
  dataHandler: {
    onDocChange: (id: string, data: CharacterDocument) => void;
    onDocRemove: (id: string) => void;
    onLoaded: () => void;
  },
  onError: (error: any) => void
) {
  if (!uid) {
    return;
  }
  const characterQuery = query(
    getCharacterCollection(),
    where("uid", "==", uid)
  );
  return onSnapshot(
    characterQuery,
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
