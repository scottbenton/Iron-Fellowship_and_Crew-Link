import { createApiFunction } from "api-calls/createApiFunction";
import { updateDoc } from "firebase/firestore";
import { getNPCDoc } from "./_getRef";

export const updateNPCCharacterBondProgress = createApiFunction<
  {
    worldId: string;
    npcId: string;
    characterId: string;
    progress: number;
  },
  void
>((params) => {
  const { worldId, npcId, characterId, progress } = params;

  return new Promise((resolve, reject) => {
    updateDoc(getNPCDoc(worldId, npcId), {
      [`characterBondProgress.${characterId}`]: progress,
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } as any)
      .then(() => resolve())
      .catch(reject);
  });
}, "Error updating npc bond progress.");
