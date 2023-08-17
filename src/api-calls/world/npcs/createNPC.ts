import { addDoc, Timestamp } from "firebase/firestore";
import { getNPCCollection } from "./_getRef";
import { createApiFunction } from "api-calls/createApiFunction";
import { NPC_SPECIES } from "types/NPCs.type";

export const createNPC = createApiFunction<
  { worldId: string; shared?: boolean },
  string
>((params) => {
  const { worldId } = params;
  return new Promise((resolve, reject) => {
    addDoc(getNPCCollection(worldId), {
      name: "New NPC",
      species: NPC_SPECIES.IRONLANDER,
      sharedWithPlayers: true,
      updatedTimestamp: Timestamp.now(),
      createdTimestamp: Timestamp.now(),
    })
      .then((doc) => {
        resolve(doc.id);
      })
      .catch((e) => {
        reject(e);
      });
  });
}, "Failed to create a new npc.");
