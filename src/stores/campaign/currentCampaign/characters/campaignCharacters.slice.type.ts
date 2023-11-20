import { Unsubscribe } from "firebase/firestore";
import { StoredAsset } from "types/Asset.type";
import { CharacterDocument } from "types/Character.type";
import { ProgressTrack, TRACK_TYPES } from "types/Track.type";

export interface CampaignCharactersSliceData {
  characterMap: { [characterId: string]: CharacterDocument };
  characterAssets: { [characterId: string]: StoredAsset[] };

  characterTracks: {
    [characterId: string]: {
      [TRACK_TYPES.FRAY]: {
        [key: string]: ProgressTrack;
      };
      [TRACK_TYPES.JOURNEY]: {
        [key: string]: ProgressTrack;
      };
      [TRACK_TYPES.VOW]: {
        [key: string]: ProgressTrack;
      };
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
