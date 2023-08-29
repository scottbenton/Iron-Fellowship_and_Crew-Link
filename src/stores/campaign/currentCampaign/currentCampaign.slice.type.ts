import { Unsubscribe } from "firebase/firestore";
import { StoredCampaign } from "types/Campaign.type";
import { CharacterDocument } from "types/Character.type";
import { CampaignTracksSlice } from "./tracks/campaignTracks.slice.type";
import { CampaignCharactersSlice } from "./characters/campaignCharacters.slice.type";

export interface CurrentCampaignSliceData {
  currentCampaignId?: string;
  currentCampaign?: StoredCampaign;
}

export interface CurrentCampaignSliceActions {
  setCurrentCampaignId: (campaignId?: string) => void;
  setCurrentCampaign: (campaign?: StoredCampaign) => void;

  updateCampaignWorld: (worldId?: string) => Promise<void>;
  updateCampaignGM: (gmId: string, shouldRemove?: boolean) => Promise<void>;
  deleteCampaign: () => Promise<void>;
  leaveCampaign: () => Promise<void>;
  addCharacter: (characterId: string) => Promise<void>;
  removeCharacter: (characterId: string) => Promise<void>;
  updateCampaignSupply: (supply: number) => Promise<void>;
  updateCampaign: (campaign: Partial<StoredCampaign>) => Promise<void>;

  resetStore: () => void;
}

export type CurrentCampaignSlice = CurrentCampaignSliceData &
  CurrentCampaignSliceActions & {
    tracks: CampaignTracksSlice;
    characters: CampaignCharactersSlice;
  };
