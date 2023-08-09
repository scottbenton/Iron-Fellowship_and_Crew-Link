import { Unsubscribe } from "firebase/auth";
import { onSnapshot, query, where } from "firebase/firestore";
import { LoreDocument } from "types/Lore.type";
import {
  constructLoreImagePath,
  convertFromDatabase,
  getLoreCollection,
} from "./_getRef";
import { getImageUrl } from "lib/storage.lib";

export function listenToLoreDocuments(
  worldId: string,
  isWorldOwner: boolean,
  updateLore: (loreId: string, lore: LoreDocument) => void,
  updateLoreImage: (loreId: string, imageUrl: string) => void,
  removeLore: (loreId: string) => void,
  onError: (error: string) => void
): Unsubscribe {
  const loreCollectionRef = getLoreCollection(worldId);

  return onSnapshot(
    isWorldOwner
      ? loreCollectionRef
      : query(loreCollectionRef, where("sharedWithPlayers", "==", true)),
    (snapshot) => {
      snapshot.docChanges().forEach((change) => {
        if (change.type === "removed") {
          removeLore(change.doc.id);
        } else {
          const convertedDoc = convertFromDatabase(change.doc.data());
          updateLore(change.doc.id, convertedDoc);
          if (
            Array.isArray(convertedDoc.imageFilenames) &&
            convertedDoc.imageFilenames.length > 0
          ) {
            getImageUrl(
              constructLoreImagePath(
                worldId,
                change.doc.id,
                convertedDoc.imageFilenames[0]
              )
            ).then((url) => {
              updateLoreImage(change.doc.id, url);
            });
          }
        }
      });
    },
    (error) => {
      console.error(error);
      onError("Failed to get lore documents.");
    }
  );
}
