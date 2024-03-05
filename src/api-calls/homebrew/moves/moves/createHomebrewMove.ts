import { createApiFunction } from "api-calls/createApiFunction";
import { addDoc } from "firebase/firestore";
import { getHomebrewMoveCollection } from "./_getRef";
import { StoredMove } from "types/homebrew/HomebrewMoves.type";

export const createHomebrewMove = createApiFunction<{ move: StoredMove }, void>(
  (params) => {
    const { move } = params;
    return new Promise((resolve, reject) => {
      addDoc(getHomebrewMoveCollection(), move)
        .then(() => resolve())
        .catch(reject);
    });
  },
  "Failed to create move."
);
