import { createApiFunction } from "api-calls/createApiFunction";
import { setDoc } from "firebase/firestore";
import { getHomebrewOraclesDoc } from "./_getRef";

export const createHomebrewOraclesDoc = createApiFunction<string, void>(
  (homebrewId) => {
    return new Promise((resolve, reject) => {
      setDoc(getHomebrewOraclesDoc(homebrewId), {}).then(resolve).catch(reject);
    });
  },
  "Failed to create empty oracle document."
);
