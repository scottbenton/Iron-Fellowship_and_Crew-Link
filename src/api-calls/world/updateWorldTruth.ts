import { updateDoc } from "firebase/firestore";
import { getWorldDoc } from "./_getRef";
import { createApiFunction } from "api-calls/createApiFunction";
import { Truth } from "types/World.type";
import { encodeDataswornId } from "functions/dataswornIdEncoder";

export const updateWorldTruth = createApiFunction<
  { worldId: string; truthId: string; truth: Truth },
  void
>((params) => {
  const { worldId, truthId, truth } = params;

  return new Promise((resolve, reject) => {
    updateDoc(getWorldDoc(worldId), {
      [`truths.${encodeDataswornId(truthId)}`]: truth,
    })
      .then(() => {
        resolve();
      })
      .catch((e) => {
        reject(e);
      });
  });
}, "Failed to update world truth.");
