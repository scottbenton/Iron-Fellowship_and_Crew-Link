import { UserNotLoggedInException } from "api/error/UserNotLoggedInException";
import { addDoc, Timestamp } from "firebase/firestore";
import { ApiFunction, useApiState } from "hooks/useApiState";
import { getNPCCollection } from "./_getRef";
import { NPC_SPECIES } from "types/NPCs.type";

export const createNPC: ApiFunction<string, string> = (worldId) => {
  return new Promise((resolve, reject) => {
    addDoc(getNPCCollection(worldId), {
      name: "New NPC",
      species: NPC_SPECIES.IRONLANDER,
      sharedWithPlayers: true,
      updatedTimestamp: Timestamp.now(),
    })
      .then((doc) => {
        resolve(doc.id);
      })
      .catch((e) => {
        console.error(e);
        reject("Failed to create new location");
      });
  });
};

export function useCreateNPC() {
  const { call, ...rest } = useApiState(createNPC);

  return {
    createNPC: (worldId: string) => call(worldId),
    ...rest,
  };
}
