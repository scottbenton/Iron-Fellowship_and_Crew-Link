import { createApiFunction } from "api-calls/createApiFunction";
import { updateDoc } from "firebase/firestore";
import { getNPCDoc } from "./_getRef";

export const updateNPCCharacterBond = createApiFunction<
  {
    worldId: string;
    npcId: string;
    characterId: string;
    bonded: boolean;
  },
  void
>((params) => {
  const { worldId, npcId, characterId, bonded } = params;

  return new Promise((resolve, reject) => {
    updateDoc(getNPCDoc(worldId, npcId), {
      [`characterBonds.${characterId}`]: bonded,
    })
      .then(() => resolve())
      .catch(reject);
  });
}, "Error updating npc bonds.");
