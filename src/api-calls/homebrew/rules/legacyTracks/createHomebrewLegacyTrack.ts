import { createApiFunction } from "api-calls/createApiFunction";
import { addDoc } from "firebase/firestore";
import { getHomebrewLegacyTrackCollection } from "./_getRef";
import { StoredLegacyTrack } from "types/homebrew/HomebrewRules.type";

export const createHomebrewLegacyTrack = createApiFunction<
  {
    legacyTrack: StoredLegacyTrack;
  },
  void
>((params) => {
  const { legacyTrack } = params;
  return new Promise((resolve, reject) => {
    addDoc(getHomebrewLegacyTrackCollection(), legacyTrack)
      .then(() => {
        resolve();
      })
      .catch(reject);
  });
}, "Failed to create legacy track.");
