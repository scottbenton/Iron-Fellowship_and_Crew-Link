import { UserNotLoggedInException } from "api/error/UserNotLoggedInException";
import { addDoc } from "firebase/firestore";
import { encodeDataswornId } from "functions/dataswornIdEncoder";
import { ApiFunction, useApiState } from "hooks/useApiState";
import { useAuth } from "hooks/useAuth";
import { EncodedWorld, Truth, TRUTH_IDS, World } from "types/World.type";
import { encodeWorld, getWorldCollection } from "./_getRef";

export const createWorld: ApiFunction<
  { uid?: string; world: World },
  string
> = ({ uid, world }) => {
  return new Promise((resolve, reject) => {
    if (!uid) {
      reject(new UserNotLoggedInException());
      return;
    }

    addDoc(getWorldCollection(uid), encodeWorld(world))
      .then((doc) => {
        resolve(doc.id);
      })
      .catch((e) => {
        console.error(e);
        reject("Failed to create world.");
      });
  });
};

export function useCreateWorld() {
  const { call, ...state } = useApiState(createWorld);
  const uid = useAuth().user?.uid;

  return {
    createWorld: (world: World) => call({ uid, world }),
    ...state,
  };
}
