import { setDoc } from "firebase/firestore";
import { ApiFunction, useApiState } from "hooks/useApiState";
import { GMNPCDocument } from "types/NPCs.type";
import { getPrivateDetailsNPCDoc } from "./_getRef";

interface Params {
  worldId: string;
  npcId: string;
  npcGMProperties: Partial<GMNPCDocument>;
}

export const updateNPCGMProperties: ApiFunction<Params, boolean> = (params) => {
  const { worldId, npcId, npcGMProperties } = params;

  return new Promise((resolve, reject) => {
    setDoc(getPrivateDetailsNPCDoc(worldId, npcId), npcGMProperties, {
      merge: true,
    })
      .then(() => {
        resolve(true);
      })
      .catch((e) => {
        console.error(e);
        reject("Failed to update npc.");
      });
  });
};

export function useUpdateNPCGMProperties() {
  const { call, ...rest } = useApiState(updateNPCGMProperties);

  return {
    updateNPCGMProperties: call,
    ...rest,
  };
}
