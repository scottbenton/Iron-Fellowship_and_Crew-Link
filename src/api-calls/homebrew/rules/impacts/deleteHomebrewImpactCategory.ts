import { createApiFunction } from "api-calls/createApiFunction";
import { deleteDoc } from "firebase/firestore";
import { getHomebrewImpactsDoc } from "./_getRef";

export const deleteHomebrewImpactCategory = createApiFunction<
  {
    impactCategoryId: string;
  },
  void
>((params) => {
  const { impactCategoryId } = params;
  return new Promise((resolve, reject) => {
    deleteDoc(getHomebrewImpactsDoc(impactCategoryId))
      .then(() => {
        resolve();
      })
      .catch(reject);
  });
}, "Failed to delete impact category.");
