export interface StoredCampaign {
  name: string;
  users: string[];
  characters: { uid: string; characterId: string }[];
  supply: number;
  gmIds?: string[];
  worldId?: string;
  expansionIds?: string[];
}
