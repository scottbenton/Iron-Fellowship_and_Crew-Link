import { createApiFunction } from "api-calls/createApiFunction";
import { updateDoc } from "firebase/firestore";
import { getHomebrewImpactsDoc } from "./_getRef";
import { StoredImpact } from "types/homebrew/HomebrewRules.type";

export const updateHomebrewImpact = createApiFunction<
  {
    impactCategoryId: string;
    impact: StoredImpact;
  },
  void
>((params) => {
  const { impactCategoryId, impact } = params;
  return new Promise((resolve, reject) => {
    updateDoc(getHomebrewImpactsDoc(impactCategoryId), {
      [`contents.${impact.dataswornId}`]: impact,
    })
      .then(() => {
        resolve();
      })
      .catch(reject);
  });
}, "Failed to update impact.");
