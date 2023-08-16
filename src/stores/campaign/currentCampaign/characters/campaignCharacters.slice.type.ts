import { Unsubscribe } from "firebase/firestore";
import { StoredAsset } from "types/Asset.type";
import { CharacterDocument } from "types/Character.type";
import { TRACK_TYPES, TrackWithId } from "types/Track.type";

export interface CampaignCharactersSliceData {
  characterMap: { [characterId: string]: CharacterDocument };
  characterAssets: { [characterId: string]: StoredAsset[] };

  characterTracks: {
    [characterId: string]: {
      [TRACK_TYPES.VOW]: TrackWithId[];
      [TRACK_TYPES.JOURNEY]: TrackWithId[];
      [TRACK_TYPES.FRAY]: TrackWithId[];
    };
  };
}
export interface CampaignCharactersSliceActions {
  listenToCampaignCharacters: (characterIds: string[]) => Unsubscribe;
  listenToCampaignCharacterAssets: (characterIds: string[]) => Unsubscribe;
  listenToCampaignCharacterTracks: (characterIds: string[]) => Unsubscribe;

  updateCharacter: (
    characterId: string,
    character: Partial<CharacterDocument>
  ) => Promise<void>;

  resetStore: () => void;
}

export type CampaignCharactersSlice = CampaignCharactersSliceData &
  CampaignCharactersSliceActions;
