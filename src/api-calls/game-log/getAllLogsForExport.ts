import { getDocs, orderBy, query, where } from "firebase/firestore";
import { Roll } from "types/DieRolls.type";
import {
  convertFromDatabase,
  getCampaignGameLogCollection,
  getCharacterGameLogCollection,
} from "./_getRef";

export interface GameLogExportRecord {
  id: string;
  roll: Roll;
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
    roll: convertFromDatabase(doc.data()),
  }));
}
