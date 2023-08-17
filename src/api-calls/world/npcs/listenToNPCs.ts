import { Unsubscribe } from "firebase/auth";
import { onSnapshot, query, where } from "firebase/firestore";
import { NPCDocument } from "types/NPCs.type";
import {
  constructNPCImagePath,
  convertFromDatabase,
  getNPCCollection,
} from "./_getRef";
import { getImageUrl } from "lib/storage.lib";

export function listenToNPCs(
  worldId: string,
  isWorldOwner: boolean,
  updateNPC: (npcId: string, npc: NPCDocument) => void,
  updateNPCImage: (npcId: string, imageUrl: string) => void,
  removeNPC: (npcId: string) => void,
  onError: (error: string) => void
): Unsubscribe {
  const npcCollectionRef = getNPCCollection(worldId);

  return onSnapshot(
    isWorldOwner
      ? npcCollectionRef
      : query(npcCollectionRef, where("sharedWithPlayers", "==", true)),
    (snapshot) => {
      snapshot.docChanges().forEach((change) => {
        if (change.type === "removed") {
          removeNPC(change.doc.id);
        } else {
          const convertedDoc = convertFromDatabase(change.doc.data());
          updateNPC(change.doc.id, convertedDoc);
          if (
            Array.isArray(convertedDoc.imageFilenames) &&
            convertedDoc.imageFilenames.length > 0
          ) {
            getImageUrl(
              constructNPCImagePath(
                worldId,
                change.doc.id,
                convertedDoc.imageFilenames[0]
              )
            ).then((url) => {
              updateNPCImage(change.doc.id, url);
            });
          }
        }
      });
    },
    (error) => {
      console.error(error);
      onError("Failed to get npcs");
    }
  );
}
