import { createApiFunction } from "api-calls/createApiFunction";
import { Roll } from "types/DieRolls.type";
import {
  DatabaseLog,
  convertFromDatabase,
  getCampaignGameLogCollection,
  getCharacterGameLogCollection,
} from "./_getRef";
import {
  QueryConstraint,
  getDocs,
  limit,
  orderBy,
  query,
  where,
} from "firebase/firestore";

export const getPaginatedLogs = createApiFunction<
  {
    oldestLogDate?: Date;
    amountToFetch: number;
    isGM: boolean;
    campaignId?: string;
    characterId?: string;
  },
  Roll[]
>((params) => {
  const { oldestLogDate, amountToFetch, isGM, campaignId, characterId } =
    params;

  return new Promise((resolve, reject) => {
    if (!campaignId && !characterId) {
      reject(new Error("Either campaign or character ID must be defined."));
      return;
    }

    const collection = campaignId
      ? getCampaignGameLogCollection(campaignId)
      : getCharacterGameLogCollection(characterId as string);

    const queryConstraints: QueryConstraint[] = [
      orderBy("timestamp", "desc"),
      limit(amountToFetch),
    ];
    if (!isGM) {
      queryConstraints.push(where("gmsOnly", "==", false));
    }
    if (oldestLogDate) {
      queryConstraints.push(where("timestamp", "<", oldestLogDate));
    }

    getDocs(query(collection, ...queryConstraints))
      .then((snapshot) => {
        const logs = snapshot.docs.map((doc) => {
          return convertFromDatabase(doc.data() as unknown as DatabaseLog);
        });
        resolve(logs.reverse());
      })
      .catch(reject);
  });
}, "Failed to load logs.");
