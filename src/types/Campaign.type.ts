export interface StoredCampaign {
  name: string;
  users: string[];
  characters: { uid: string; characterId: string }[];
  supply: number;
  gmId?: string;
  worldId?: string;
}
