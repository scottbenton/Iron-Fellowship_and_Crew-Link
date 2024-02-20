import { createApiFunction } from "api-calls/createApiFunction";
import { PartialWithFieldValue, updateDoc } from "firebase/firestore";
import { getHomebrewImpactsDoc } from "./_getRef";
import { StoredImpactCategory } from "types/homebrew/HomebrewRules.type";

export const updateHomebrewImpactCategory = createApiFunction<
  {
    impactCategoryId: string;
    impactCategory: PartialWithFieldValue<StoredImpactCategory>;
  },
  void
>((params) => {
  const { impactCategoryId, impactCategory } = params;
  return new Promise((resolve, reject) => {
    updateDoc(getHomebrewImpactsDoc(impactCategoryId), impactCategory)
      .then(() => {
        resolve();
      })
      .catch(reject);
  });
}, "Failed to update condition meter.");
