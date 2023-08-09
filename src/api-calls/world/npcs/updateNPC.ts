import { updateDoc } from "firebase/firestore";
import { NPCDocument } from "types/NPCs.type";
import { convertToDatabase, getNPCDoc } from "./_getRef";
import { createApiFunction } from "api-calls/createApiFunction";

interface NPCParams {
  worldId: string;
  npcId: string;
  npc: Partial<NPCDocument>;
}

export const updateNPC = createApiFunction<NPCParams, void>((params) => {
  const { worldId, npcId, npc } = params;

  return new Promise((resolve, reject) => {
    updateDoc(getNPCDoc(worldId, npcId), convertToDatabase(npc))
      .then(() => {
        resolve();
      })
      .catch((e) => {
        reject(e);
      });
  });
}, "Failed to update npc.");
