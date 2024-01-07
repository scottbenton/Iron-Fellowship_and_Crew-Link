import { addDoc } from "firebase/firestore";
import { getHomebrewCollection } from "./_getRef";
import { BaseExpansion } from "types/homebrew/HomebrewCollection.type";
import { createApiFunction } from "api-calls/createApiFunction";
import { createHomebrewOraclesDoc } from "./oracles/createHomebrewOraclesDoc";

export const createHomebrewExpansion = createApiFunction<BaseExpansion, string>(
  (expansion: BaseExpansion) => {
    return new Promise((resolve, reject) => {
      addDoc(getHomebrewCollection(), expansion)
        .then((doc) => {
          createHomebrewOraclesDoc(doc.id)
            .then(() => {
              resolve(doc.id);
            })
            .catch(reject);
        })
        .catch(reject);
    });
  },
  "Failed to create expansion."
);
