import { createApiFunction } from "api-calls/createApiFunction";
import { PartialWithFieldValue, updateDoc } from "firebase/firestore";
import { getHomebrewStatsDoc } from "./_getRef";
import { StoredStat } from "types/homebrew/HomebrewRules.type";

export const updateHomebrewStat = createApiFunction<
  {
    statId: string;
    stat: PartialWithFieldValue<StoredStat>;
  },
  void
>((params) => {
  const { statId, stat } = params;
  return new Promise((resolve, reject) => {
    updateDoc(getHomebrewStatsDoc(statId), stat)
      .then(() => {
        resolve();
      })
      .catch(reject);
  });
}, "Failed to update stat.");
