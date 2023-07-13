import { UserNotLoggedInException } from "api/error/UserNotLoggedInException";
import { addDoc, serverTimestamp, Timestamp } from "firebase/firestore";
import { ApiFunction, useApiState } from "hooks/useApiState";
import { getLoreCollection } from "./_getRef";

export const createLore: ApiFunction<
  { worldId: string; shared?: boolean },
  string
> = (params) => {
  const { worldId } = params;
  return new Promise((resolve, reject) => {
    addDoc(getLoreCollection(worldId), {
      name: "New Lore Document",
      sharedWithPlayers: true,
      updatedTimestamp: Timestamp.now(),
      createdTimestamp: Timestamp.now(),
    })
      .then((doc) => {
        resolve(doc.id);
      })
      .catch((e) => {
        console.error(e);
        reject("Failed to create new lore document");
      });
  });
};

export function useCreateLore() {
  const { call, ...rest } = useApiState(createLore);

  return {
    createLore: (worldId: string) => call({ worldId }),
    ...rest,
  };
}
