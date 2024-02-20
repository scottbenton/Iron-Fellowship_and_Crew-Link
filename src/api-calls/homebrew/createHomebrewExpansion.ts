import { addDoc } from "firebase/firestore";
import { getHomebrewCollection } from "./_getRef";
import { ExpansionDocument } from "types/homebrew/HomebrewCollection.type";
import { createApiFunction } from "api-calls/createApiFunction";

export const createHomebrewExpansion = createApiFunction<
  ExpansionDocument,
  string
>((expansion: ExpansionDocument) => {
  return new Promise((resolve, reject) => {
    addDoc(getHomebrewCollection(), expansion)
      .then((doc) => {
        resolve(doc.id);
      })
      .catch(reject);
  });
}, "Failed to create expansion.");
