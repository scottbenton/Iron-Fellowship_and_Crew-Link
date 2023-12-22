import { createApiFunction } from "api-calls/createApiFunction";
import { PartialWithFieldValue, updateDoc } from "firebase/firestore";
import { getHomebrewRulesDoc } from "./_getRef";
import { StoredRules } from "types/homebrew/HomebrewRules.type";

export const updateHomebrewRules = createApiFunction<
  {
    homebrewId: string;
    rules: PartialWithFieldValue<Partial<StoredRules>>;
  },
  void
>((params) => {
  const { homebrewId, rules } = params;
  return new Promise((resolve, reject) => {
    updateDoc(getHomebrewRulesDoc(homebrewId), rules)
      .then(() => {
        resolve();
      })
      .catch(reject);
  });
}, "Failed to update rules.");
