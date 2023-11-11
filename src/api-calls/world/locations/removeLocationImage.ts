import { createApiFunction } from "api-calls/createApiFunction";
import { updateLocation } from "./updateLocation";
import { constructLocationImagesPath } from "./_getRef";
import { deleteImage } from "lib/storage.lib";

export const removeLocationImage = createApiFunction<
  {
    worldId: string;
    locationId: string;
    filename: string;
  },
  void
>((params) => {
  const { worldId, locationId, filename } = params;

  return new Promise((resolve, reject) => {
    updateLocation({
      worldId,
      locationId,
      location: { imageFilenames: [] },
    })
      .then(() => {
        deleteImage(
          constructLocationImagesPath(worldId, locationId),
          filename
        ).catch((e) => console.error("Failed to remove image from storage."));
        resolve();
      })
      .catch(reject);
  });
}, "Failed to delete location image.");
