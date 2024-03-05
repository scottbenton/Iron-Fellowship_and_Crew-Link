import { createApiFunction } from "api-calls/createApiFunction";
import { PartialWithFieldValue, updateDoc } from "firebase/firestore";
import { getHomebrewMoveCategoryDoc } from "./_getRef";
import { StoredMoveCategory } from "types/homebrew/HomebrewMoves.type";

export const updateHomebrewMoveCategory = createApiFunction<
  {
    moveCategoryId: string;
    moveCategory: PartialWithFieldValue<StoredMoveCategory>;
  },
  void
>((params) => {
  const { moveCategory, moveCategoryId } = params;
  return new Promise((resolve, reject) => {
    updateDoc(getHomebrewMoveCategoryDoc(moveCategoryId), moveCategory)
      .then(() => resolve())
      .catch(reject);
  });
}, "Failed to update move category.");
