import { createApiFunction } from "api-calls/createApiFunction";
import { PartialWithFieldValue, setDoc } from "firebase/firestore";
import { getHomebrewRulesDoc } from "./_getRef";
import { StoredRules } from "types/HomebrewCollection.type";

export const updateExpansionRules = createApiFunction<
  {
    homebrewId: string;
    rules: PartialWithFieldValue<StoredRules>;
  },
  void
>((params) => {
  const { homebrewId, rules } = params;
  return new Promise((resolve, reject) => {
    setDoc(getHomebrewRulesDoc(homebrewId), rules, { merge: true })
      .then(() => {
        resolve();
      })
      .catch(reject);
  });
}, "Failed to update rules.");
