import { addDoc, Timestamp } from "firebase/firestore";
import { getNPCCollection } from "./_getRef";
import { createApiFunction } from "api-calls/createApiFunction";
import { NPCDocument } from "types/NPCs.type";

export const createNPC = createApiFunction<
  { worldId: string; npc?: Partial<NPCDocument> },
  string
>((params) => {
  const { worldId, npc } = params;
  return new Promise((resolve, reject) => {
    addDoc(getNPCCollection(worldId), {
      name: "New NPC",
      sharedWithPlayers: true,
      updatedTimestamp: Timestamp.now(),
      createdTimestamp: Timestamp.now(),
      ...npc,
    })
      .then((doc) => {
        resolve(doc.id);
      })
      .catch((e) => {
        reject(e);
      });
  });
}, "Failed to create a new npc.");
