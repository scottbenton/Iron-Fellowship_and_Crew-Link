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
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } as any)
      .then(() => resolve())
      .catch(reject);
  });
}, "Error updating npc bonds.");
