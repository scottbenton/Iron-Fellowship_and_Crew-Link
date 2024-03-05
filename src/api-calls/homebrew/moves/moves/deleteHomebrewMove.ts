import { createApiFunction } from "api-calls/createApiFunction";
import { deleteDoc } from "firebase/firestore";
import { getHomebrewMoveDoc } from "./_getRef";

export const deleteHomebrewMove = createApiFunction<
  {
    moveId: string;
  },
  void
>((params) => {
  const { moveId } = params;
  return new Promise((resolve, reject) => {
    deleteDoc(getHomebrewMoveDoc(moveId)).then(resolve).catch(reject);
  });
}, "Failed to delete move.");
