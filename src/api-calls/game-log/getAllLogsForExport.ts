import { getDocs, orderBy, query, where } from "firebase/firestore";
import {
  getCampaignGameLogCollection,
  getCharacterGameLogCollection,
} from "./_getRef";
import { GameLogDocument } from "./_game-log.type";

export interface GameLogExportRecord {
  id: string;
  roll: Record<string, unknown>;
}

function serializeLogForExport(log: GameLogDocument): Record<string, unknown> {
  const { timestamp, ...rest } = log;
  const timestampDate = timestamp?.toDate?.();

  return {
    ...rest,
    timestamp: timestampDate?.toISOString() ?? null,
  };
}

export async function getAllLogsForExport(params: {
  campaignId?: string;
  characterId?: string;
  isGM: boolean;
}): Promise<GameLogExportRecord[]> {
  const { campaignId, characterId, isGM } = params;

  if (!campaignId && !characterId) {
    throw new Error("Either campaignId or characterId must be defined.");
  }

  const collectionRef = campaignId
    ? getCampaignGameLogCollection(campaignId)
    : getCharacterGameLogCollection(characterId as string);

  const q = isGM
    ? query(collectionRef, orderBy("timestamp", "asc"))
    : query(
        collectionRef,
        where("gmsOnly", "==", false),
        orderBy("timestamp", "asc")
      );

  const snapshot = await getDocs(q);
  return snapshot.docs.map((doc) => ({
    id: doc.id,
    roll: serializeLogForExport(doc.data()),
  }));
}
