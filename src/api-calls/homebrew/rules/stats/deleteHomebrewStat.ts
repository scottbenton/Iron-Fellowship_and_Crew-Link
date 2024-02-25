import { createApiFunction } from "api-calls/createApiFunction";
import { deleteDoc } from "firebase/firestore";
import { getHomebrewStatsDoc } from "./_getRef";

export const deleteHomebrewStat = createApiFunction<
  {
    statId: string;
  },
  void
>((params) => {
  const { statId } = params;
  return new Promise((resolve, reject) => {
    deleteDoc(getHomebrewStatsDoc(statId))
      .then(() => {
        resolve();
      })
      .catch(reject);
  });
}, "Failed to delete stat.");
