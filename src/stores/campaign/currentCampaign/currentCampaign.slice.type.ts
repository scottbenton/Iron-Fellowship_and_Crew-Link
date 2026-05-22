import { CampaignDocument } from "api-calls/campaign/_campaign.type";
import { CampaignTracksSlice } from "./tracks/campaignTracks.slice.type";
import { CampaignCharactersSlice } from "./characters/campaignCharacters.slice.type";
import { SharedAssetSlice } from "./sharedAssets/sharedAssets.slice.type";

export interface CurrentCampaignSliceData {
  currentCampaignId?: string;
  currentCampaign?: CampaignDocument;
}

export interface CurrentCampaignSliceActions {
  setCurrentCampaignId: (campaignId?: string) => void;
  setCurrentCampaign: (campaign?: CampaignDocument) => void;

  updateCampaignWorld: (worldId?: string) => Promise<void>;
  updateCampaignGM: (gmId: string, shouldRemove?: boolean) => Promise<void>;
  deleteCampaign: () => Promise<void>;
  leaveCampaign: () => Promise<void>;
  removePlayerFromCampaign: (uid: string) => Promise<void>;
  addCharacter: (characterId: string) => Promise<void>;
  removeCharacter: (userId: string, characterId: string) => Promise<void>;
  updateCampaignConditionMeter: (
    conditionMeterKey: string,
    value: number
  ) => Promise<void>;
  updateCampaign: (campaign: Partial<CampaignDocument>) => Promise<void>;
  updateHiddenAssets: (
    assetId: string,
    isHidden: boolean
  ) => Promise<void>;
  updateHiddenOracles: (
    oracleId: string,
    isHidden: boolean
  ) => Promise<void>;

  resetStore: () => void;
}

export type CurrentCampaignSlice = CurrentCampaignSliceData &
  CurrentCampaignSliceActions & {
    tracks: CampaignTracksSlice;
    characters: CampaignCharactersSlice;
    assets: SharedAssetSlice;
  };
