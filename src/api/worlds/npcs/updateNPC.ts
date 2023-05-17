import { updateDoc } from "firebase/firestore";
import { ApiFunction, useApiState } from "hooks/useApiState";
import { NPCDocument } from "types/NPCs.type";
import { convertToDatabase, getNPCDoc } from "./_getRef";

interface NPCParams {
  worldId: string;
  npcId: string;
  npc: Partial<NPCDocument>;
}

export const updateNPC: ApiFunction<NPCParams, boolean> = (params) => {
  const { worldId, npcId, npc } = params;

  return new Promise((resolve, reject) => {
    updateDoc(getNPCDoc(worldId, npcId), convertToDatabase(npc))
      .then(() => {
        resolve(true);
      })
      .catch((e) => {
        console.error(e);
        reject("Failed to update npc");
      });
  });
};

export function useUpdateNPC() {
  const { call, ...rest } = useApiState(updateNPC);

  return {
    updateNPC: (params: NPCParams) => call(params),
    ...rest,
  };
}
