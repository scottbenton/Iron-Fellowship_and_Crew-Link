import {
  DocumentSnapshot,
  QueryConstraint,
  Unsubscribe,
  endBefore,
  limit,
  onSnapshot,
  orderBy,
  query,
  startAfter,
  where,
} from "firebase/firestore";
import { Roll } from "types/DieRolls.type";
import {
  DatabaseLog,
  convertFromDatabase,
  getCampaignGameLogCollection,
  getCharacterGameLogCollection,
} from "./_getRef";

export function listenToMostRecentCharacterLog(params: {
  isGM: boolean;
  campaignId?: string;
  characterId: string;
  onRoll: (rollId: string, roll: Roll) => void;
  onError: (error: string) => void;
}): Unsubscribe {
  const { isGM, campaignId, characterId, onRoll, onError } = params;

  const collection = campaignId
    ? getCampaignGameLogCollection(campaignId)
    : getCharacterGameLogCollection(characterId as string);

  const queryConstraints: QueryConstraint[] = [
    where("timestamp", ">", new Date()),
    where("characterId", "==", characterId),
    orderBy("timestamp", "desc"),
    limit(1),
  ];
  if (!isGM) {
    queryConstraints.push(where("gmsOnly", "==", false));
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
