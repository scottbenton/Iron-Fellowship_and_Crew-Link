import { Themes } from "providers/ThemeProvider/themes/theme.types";
import { LegacyTrack } from "types/LegacyTrack.type";

export enum CampaignType {
  Solo = "solo",
  Coop = "co-op",
  Guided = "guided",
}

export interface CampaignDocument {
  name: string;
  users: string[];
  characters: { uid: string; characterId: string }[];
  gmIds?: string[];
  worldId?: string;
  expansionIds?: string[];
  hiddenAssetIds?: string[];
  hiddenOracleIds?: string[];
  customTracks?: Record<string, number>;
  conditionMeters?: Record<string, number>;
  specialTracks?: Record<string, LegacyTrack>;
  type?: CampaignType;
  theme?: Themes;
}
