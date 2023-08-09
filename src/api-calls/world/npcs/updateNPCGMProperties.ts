import { setDoc } from "firebase/firestore";
import { GMNPCDocument } from "types/NPCs.type";
import { getPrivateDetailsNPCDoc } from "./_getRef";
import { createApiFunction } from "api-calls/createApiFunction";

interface Params {
  worldId: string;
  npcId: string;
  npcGMProperties: Partial<GMNPCDocument>;
}

export const updateNPCGMProperties = createApiFunction<Params, void>(
  (params) => {
    const { worldId, npcId, npcGMProperties } = params;

    return new Promise((resolve, reject) => {
      setDoc(getPrivateDetailsNPCDoc(worldId, npcId), npcGMProperties, {
        merge: true,
      })
        .then(() => {
          resolve();
        })
        .catch((e) => {
          reject(e);
        });
    });
  },
  "Failed to update npc."
);
