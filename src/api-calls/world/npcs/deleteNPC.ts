import { deleteDoc } from "firebase/firestore";
import {
  constructNPCImagesPath,
  getNPCDoc,
  getPrivateDetailsNPCDoc,
  getPublicNotesNPCDoc,
} from "./_getRef";
import { createApiFunction } from "api-calls/createApiFunction";
import { deleteImage } from "lib/storage.lib";

interface Params {
  worldId: string;
  npcId: string;
  imageFilename?: string;
}

export const deleteNPC = createApiFunction<Params, void>((params) => {
  const { worldId, npcId, imageFilename } = params;

  return new Promise((resolve, reject) => {
    const promises: Promise<unknown>[] = [];
    promises.push(deleteDoc(getNPCDoc(worldId, npcId)));
    promises.push(deleteDoc(getPrivateDetailsNPCDoc(worldId, npcId)));
    promises.push(deleteDoc(getPublicNotesNPCDoc(worldId, npcId)));
    if (imageFilename) {
      promises.push(
        deleteImage(constructNPCImagesPath(worldId, npcId), imageFilename)
      );
    }

    Promise.all(promises)
      .then(() => resolve())
      .catch((e) => {
        reject(e);
      });
  });
}, "Failed to delete npc.");
