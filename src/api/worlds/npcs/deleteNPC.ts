import { deleteDoc } from "firebase/firestore";
import { ApiFunction, useApiState } from "hooks/useApiState";
import {
  getNPCDoc,
  getPrivateDetailsNPCDoc,
  getPublicNotesNPCDoc,
} from "./_getRef";

interface Params {
  worldOwnerId: string;
  worldId: string;
  npcId: string;
}

export const deleteNPC: ApiFunction<Params, boolean> = (params) => {
  const { worldOwnerId, worldId, npcId } = params;

  return new Promise((resolve, reject) => {
    let promises: Promise<any>[] = [];
    promises.push(deleteDoc(getNPCDoc(worldOwnerId, worldId, npcId)));
    promises.push(
      deleteDoc(getPrivateDetailsNPCDoc(worldOwnerId, worldId, npcId))
    );
    promises.push(
      deleteDoc(getPublicNotesNPCDoc(worldOwnerId, worldId, npcId))
    );

    Promise.all(promises)
      .then(() => resolve(true))
      .catch((e) => {
        console.error(e);
        reject("Failed to delete npc");
      });
  });
};

export function useDeleteNPC() {
  const { call, ...rest } = useApiState(deleteNPC);

  return {
    deleteNPC: call,
    ...rest,
  };
}
