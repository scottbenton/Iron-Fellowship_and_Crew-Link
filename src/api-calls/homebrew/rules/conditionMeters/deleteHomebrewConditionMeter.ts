import { createApiFunction } from "api-calls/createApiFunction";
import { deleteDoc } from "firebase/firestore";
import { getHomebrewConditionMeterDoc } from "./_getRef";

export const deleteHomebrewConditionMeter = createApiFunction<
  {
    conditionMeterId: string;
  },
  void
>((params) => {
  const { conditionMeterId } = params;
  return new Promise((resolve, reject) => {
    deleteDoc(getHomebrewConditionMeterDoc(conditionMeterId))
      .then(() => {
        resolve();
      })
      .catch(reject);
  });
}, "Failed to delete condition meter.");
