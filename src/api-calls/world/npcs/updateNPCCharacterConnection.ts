import { createApiFunction } from "api-calls/createApiFunction";
import { updateDoc } from "firebase/firestore";
import { getNPCDoc } from "./_getRef";

export const updateNPCCharacterConnection = createApiFunction<
  {
    worldId: string;
    npcId: string;
    characterId: string;
    isConnection: boolean;
  },
  void
>((params) => {
  const { worldId, npcId, characterId, isConnection } = params;

  return new Promise((resolve, reject) => {
    updateDoc(getNPCDoc(worldId, npcId), {
      [`characterConnection.${characterId}`]: isConnection,
    } as any)
      .then(() => resolve())
      .catch(reject);
  });
}, "Error updating npc connection.");
