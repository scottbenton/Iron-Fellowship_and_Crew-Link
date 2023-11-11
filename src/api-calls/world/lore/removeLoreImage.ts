import { createApiFunction } from "api-calls/createApiFunction";
import { constructLoreImagesPath } from "./_getRef";
import { deleteImage } from "lib/storage.lib";
import { updateLore } from "./updateLore";

export const removeLoreImage = createApiFunction<
  {
    worldId: string;
    loreId: string;
    filename: string;
  },
  void
>((params) => {
  const { worldId, loreId, filename } = params;

  return new Promise((resolve, reject) => {
    updateLore({
      worldId,
      loreId,
      lore: { imageFilenames: [] },
    })
      .then(() => {
        deleteImage(constructLoreImagesPath(worldId, loreId), filename).catch(
          (e) => console.error("Failed to remove image from storage.")
        );
        resolve();
      })
      .catch(reject);
  });
}, "Failed to delete lore image.");
