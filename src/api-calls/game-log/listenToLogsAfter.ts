import {
  QueryConstraint,
  Unsubscribe,
  onSnapshot,
  query,
  where,
} from "firebase/firestore";
import { Roll } from "types/DieRolls.type";
import {
  DatabaseLog,
  convertFromDatabase,
  getCampaignGameLogCollection,
  getCharacterGameLogCollection,
} from "./_getRef";

export function listenToLogsAfter(params: {
  latestLoadedDate?: Date;
  isGM: boolean;
  campaignId?: string;
  characterId?: string;
  onRoll: (rollId: string, roll: Roll) => void;
  onError: (error: string) => void;
}): Unsubscribe {
  const { latestLoadedDate, isGM, campaignId, characterId, onRoll, onError } =
    params;

  if (!campaignId && !characterId) {
    onError("Either campaign or character ID must be defined.");
    return () => {};
  }

  const collection = campaignId
    ? getCampaignGameLogCollection(campaignId)
    : getCharacterGameLogCollection(characterId as string);

  const queryConstraints: QueryConstraint[] = [];
  if (!isGM) {
    queryConstraints.push(where("gmsOnly", "==", false));
  }
  if (latestLoadedDate) {
    queryConstraints.push(where("timestamp", ">", latestLoadedDate));
  }

  return onSnapshot(
    query(collection, ...queryConstraints),
    (snapshot) => {
      snapshot.docChanges().forEach((change) => {
        if (change.type === "added") {
          const doc = convertFromDatabase(
            change.doc.data() as unknown as DatabaseLog
          );
          onRoll(change.doc.id, doc);
        }
      });
    },
    (error) => {
      console.error(error);
      onError("Error getting new logs.");
    }
  );
}
