import {
  QueryConstraint,
  Unsubscribe,
  limit,
  onSnapshot,
  orderBy,
  query,
  where,
} from "firebase/firestore";
import {
  DatabaseLog,
  convertFromDatabase,
  getCampaignGameLogCollection,
  getCharacterGameLogCollection,
} from "./_getRef";
import { Roll } from "types/DieRolls.type";

export function listenToLogs(params: {
  isGM: boolean;
  campaignId?: string;
  characterId?: string;
  totalLogsToLoad: number;
  updateLog: (rollId: string, roll: Roll) => void;
  removeLog: (rollId: string) => void;
  onError: (error: string) => void;
}): Unsubscribe {
  const {
    isGM,
    campaignId,
    characterId,
    totalLogsToLoad,
    updateLog,
    removeLog,
    onError,
  } = params;

  if (!campaignId && !characterId) {
    onError("Either campaign or character ID must be defined.");
    return () => {};
  }

  const collection = campaignId
    ? getCampaignGameLogCollection(campaignId)
    : getCharacterGameLogCollection(characterId as string);

  const queryConstraints: QueryConstraint[] = [
    limit(totalLogsToLoad),
    orderBy("timestamp", "desc"),
  ];
  if (!isGM) {
    queryConstraints.push(where("gmsOnly", "==", false));
  }

  return onSnapshot(
    query(collection, ...queryConstraints),
    (snapshot) => {
      snapshot.docChanges().forEach((change) => {
        if (change.type === "added" || change.type === "modified") {
          const doc = convertFromDatabase(
            change.doc.data() as unknown as DatabaseLog
          );
          updateLog(change.doc.id, doc);
        } else if (change.type === "removed") {
          removeLog(change.doc.id);
        }
      });
    },
    (error) => {
      console.error(error);
      onError("Error getting new logs.");
    }
  );
}
