import { addDoc, Timestamp } from "firebase/firestore";
import { getSectorCollection } from "./_getRef";
import { createApiFunction } from "api-calls/createApiFunction";

export const createSector = createApiFunction<
  { worldId: string; shared?: boolean },
  string
>((params) => {
  const { worldId } = params;
  return new Promise((resolve, reject) => {
    addDoc(getSectorCollection(worldId), {
      name: "New Sector",
      map: {},
      sharedWithPlayers: true,
      createdTimestamp: Timestamp.now(),
    })
      .then((doc) => {
        resolve(doc.id);
      })
      .catch((e) => {
        reject(e);
      });
  });
}, "Failed to create a new sector.");
