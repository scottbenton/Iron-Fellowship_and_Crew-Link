import { deleteDoc } from "firebase/firestore";
import { ApiFunction, useApiState } from "hooks/useApiState";
import {
  getLoreDoc,
  getPrivateDetailsLoreDoc,
  getPublicNotesLoreDoc,
} from "./_getRef";

interface Params {
  worldId: string;
  loreId: string;
}

export const deleteLore: ApiFunction<Params, boolean> = (params) => {
  const { worldId, loreId } = params;

  return new Promise((resolve, reject) => {
    let promises: Promise<any>[] = [];
    promises.push(deleteDoc(getLoreDoc(worldId, loreId)));
    promises.push(deleteDoc(getPrivateDetailsLoreDoc(worldId, loreId)));
    promises.push(deleteDoc(getPublicNotesLoreDoc(worldId, loreId)));

    Promise.all(promises)
      .then(() => resolve(true))
      .catch((e) => {
        console.error(e);
        reject("Failed to delete lore document");
      });
  });
};

export function useDeleteLore() {
  const { call, ...rest } = useApiState(deleteLore);

  return {
    deleteLore: call,
    ...rest,
  };
}
