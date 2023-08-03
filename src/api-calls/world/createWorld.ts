import { addDoc } from "firebase/firestore";
import { World } from "types/World.type";
import { encodeWorld, getWorldCollection } from "./_getRef";
import { createApiFunction } from "api-calls/createApiFunction";

export const createWorld = createApiFunction<World, string>((world) => {
  return new Promise((resolve, reject) => {
    addDoc(getWorldCollection(), encodeWorld(world))
      .then((doc) => {
        resolve(doc.id);
      })
      .catch((e) => {
        reject(e);
      });
  });
}, "Failed to create world");
