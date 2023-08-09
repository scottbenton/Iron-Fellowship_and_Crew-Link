import { updateDoc } from "firebase/firestore";
import { getWorldDoc } from "./_getRef";
import { createApiFunction } from "api-calls/createApiFunction";
import { World } from "types/World.type";

export const updateWorld = createApiFunction<
  { worldId: string; partialWorld: Partial<World> },
  void
>((params) => {
  const { worldId, partialWorld } = params;

  return new Promise((resolve, reject) => {
    updateDoc(getWorldDoc(worldId), partialWorld)
      .then(() => {
        resolve();
      })
      .catch((e) => {
        reject(e);
      });
  });
}, "Failed to update world.");
