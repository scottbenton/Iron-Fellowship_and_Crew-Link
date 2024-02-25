import { createApiFunction } from "api-calls/createApiFunction";
import { addDoc } from "firebase/firestore";
import { getHomebrewStatsCollection } from "./_getRef";
import { StoredStat } from "types/homebrew/HomebrewRules.type";

export const createHomebrewStat = createApiFunction<
  {
    stat: StoredStat;
  },
  void
>((params) => {
  const { stat } = params;
  return new Promise((resolve, reject) => {
    addDoc(getHomebrewStatsCollection(), stat)
      .then(() => {
        resolve();
      })
      .catch(reject);
  });
}, "Failed to create stat.");
