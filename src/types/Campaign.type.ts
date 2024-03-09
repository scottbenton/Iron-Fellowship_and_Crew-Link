export interface StoredCampaign {
  name: string;
  users: string[];
  characters: { uid: string; characterId: string }[];
  gmIds?: string[];
  worldId?: string;
  expansionIds?: string[];
  conditionMeters?: Record<string, number>;
  // TODO - Remove once expansions are in
  supply: number;
}
