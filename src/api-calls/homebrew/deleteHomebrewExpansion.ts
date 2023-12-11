import { deleteDoc } from "firebase/firestore";
import { getHomebrewCollectionDoc } from "./_getRef";
import { createApiFunction } from "api-calls/createApiFunction";

export const deleteHomebrewExpansion = createApiFunction<{ id: string }, void>(
  (params) => {
    const { id } = params;

    return new Promise((resolve, reject) => {
      const promises: Promise<unknown>[] = [];

      promises.push(deleteDoc(getHomebrewCollectionDoc(id)));

      Promise.all(promises)
        .then(() => {
          resolve();
        })
        .catch(reject);
    });
  },
  "Failed to delete expansion."
);
