import { createApiFunction } from "api-calls/createApiFunction";
import { constructNPCImagesPath } from "./_getRef";
import { deleteImage } from "lib/storage.lib";
import { updateNPC } from "./updateNPC";

export const removeNPCImage = createApiFunction<
  {
    worldId: string;
    npcId: string;
    filename: string;
  },
  void
>((params) => {
  const { worldId, npcId, filename } = params;

  return new Promise((resolve, reject) => {
    updateNPC({
      worldId,
      npcId,
      npc: { imageFilenames: [] },
    })
      .then(() => {
        deleteImage(constructNPCImagesPath(worldId, npcId), filename).catch(
          () => console.error("Failed to remove image from storage.")
        );
        resolve();
      })
      .catch(reject);
  });
}, "Failed to delete npc image.");
