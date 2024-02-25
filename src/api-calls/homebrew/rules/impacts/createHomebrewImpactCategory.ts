import { createApiFunction } from "api-calls/createApiFunction";
import { addDoc } from "firebase/firestore";
import { getHomebrewImpactsCollection } from "./_getRef";
import { StoredImpactCategory } from "types/homebrew/HomebrewRules.type";

export const createHomebrewImpactCategory = createApiFunction<
  {
    impactCategory: StoredImpactCategory;
  },
  void
>((params) => {
  const { impactCategory } = params;
  return new Promise((resolve, reject) => {
    addDoc(getHomebrewImpactsCollection(), impactCategory)
      .then(() => {
        resolve();
      })
      .catch(reject);
  });
}, "Failed to create impact category.");
