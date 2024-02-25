import { createApiFunction } from "api-calls/createApiFunction";
import { addDoc } from "firebase/firestore";
import { getHomebrewConditionMeterCollection } from "./_getRef";
import { StoredConditionMeter } from "types/homebrew/HomebrewRules.type";

export const createHomebrewConditionMeter = createApiFunction<
  {
    conditionMeter: StoredConditionMeter;
  },
  void
>((params) => {
  const { conditionMeter } = params;
  return new Promise((resolve, reject) => {
    addDoc(getHomebrewConditionMeterCollection(), conditionMeter)
      .then(() => {
        resolve();
      })
      .catch(reject);
  });
}, "Failed to create condition meter.");
