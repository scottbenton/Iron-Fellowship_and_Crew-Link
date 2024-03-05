import { createApiFunction } from "api-calls/createApiFunction";
import { addDoc } from "firebase/firestore";
import { StoredMoveCategory } from "types/homebrew/HomebrewMoves.type";
import { getHomebrewMoveCategoryCollection } from "./_getRef";

export const createHomebrewMoveCategory = createApiFunction<
  { moveCategory: StoredMoveCategory },
  void
>((params) => {
  const { moveCategory } = params;
  return new Promise((resolve, reject) => {
    addDoc(getHomebrewMoveCategoryCollection(), moveCategory)
      .then(() => resolve())
      .catch(reject);
  });
}, "Failed to create move category.");
