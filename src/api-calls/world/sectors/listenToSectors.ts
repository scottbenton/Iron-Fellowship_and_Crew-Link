import { Unsubscribe } from "firebase/auth";
import { onSnapshot, query, where } from "firebase/firestore";
import { convertFromDatabase, getSectorCollection } from "./_getRef";
import { getImageUrl } from "lib/storage.lib";
import { Sector } from "types/Sector.type";

export function listenToSectors(
  worldId: string,
  isWorldOwner: boolean,
  updateSector: (sectorId: string, sector: Sector) => void,
  removeSector: (sectorId: string) => void,
  onError: (error: string) => void
): Unsubscribe {
  const sectorCollectionRef = getSectorCollection(worldId);

  return onSnapshot(
    isWorldOwner
      ? sectorCollectionRef
      : query(sectorCollectionRef, where("sharedWithPlayers", "==", true)),
    (snapshot) => {
      snapshot.docChanges().forEach((change) => {
        if (change.type === "removed") {
          removeSector(change.doc.id);
        } else {
          const convertedDoc = convertFromDatabase(change.doc.data());
          updateSector(change.doc.id, convertedDoc);
        }
      });
    },
    (error) => {
      console.error(error);
      onError("Failed to get sectors");
    }
  );
}
