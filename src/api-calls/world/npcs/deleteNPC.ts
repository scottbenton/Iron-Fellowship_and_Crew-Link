import { deleteDoc } from "firebase/firestore";
import {
  getNPCDoc,
  getPrivateDetailsNPCDoc,
  getPublicNotesNPCDoc,
} from "./_getRef";
import { createApiFunction } from "api-calls/createApiFunction";

interface Params {
  worldId: string;
  npcId: string;
}

export const deleteNPC = createApiFunction<Params, void>((params) => {
  const { worldId, npcId } = params;

  return new Promise((resolve, reject) => {
    let promises: Promise<any>[] = [];
    promises.push(deleteDoc(getNPCDoc(worldId, npcId)));
    promises.push(deleteDoc(getPrivateDetailsNPCDoc(worldId, npcId)));
    promises.push(deleteDoc(getPublicNotesNPCDoc(worldId, npcId)));

    Promise.all(promises)
      .then(() => resolve())
      .catch((e) => {
        reject(e);
      });
  });
}, "Failed to delete npc.");
