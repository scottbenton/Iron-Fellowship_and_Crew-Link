import { World } from "types/World.type";
import { decodeWorld, getWorldCollection } from "./_getRef";
import { onSnapshot, query, where } from "firebase/firestore";

export function listenToUsersWorlds(
  uid: string,
  dataHandler: {
    onDocChange: (id: string, data: World) => void;
    onDocRemove: (id: string) => void;
    onLoaded: () => void;
  },
  onError: (error: any) => void
) {
  return onSnapshot(
    query(getWorldCollection(), where("ownerIds", "array-contains", uid ?? "")),
    (snapshot) => {
      snapshot.docChanges().forEach((change) => {
        if (change.type === "removed") {
          dataHandler.onDocRemove(change.doc.id);
        } else {
          dataHandler.onDocChange(
            change.doc.id,
            decodeWorld(change.doc.data())
          );
        }
      });
      dataHandler.onLoaded();
    },
    (error) => onError(error)
  );
}
