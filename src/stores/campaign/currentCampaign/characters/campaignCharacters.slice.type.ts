import { CharacterDocument } from "api-calls/character/_character.type";
import { Unsubscribe } from "firebase/firestore";
import { AssetDocument } from "api-calls/assets/_asset.type";
import {
  Clock,
  ProgressTrack,
  SceneChallenge,
  TrackTypes,
} from "types/Track.type";

export interface CampaignCharactersSliceData {
  characterMap: Record<string, CharacterDocument>;
  characterAssets: { [characterId: string]: AssetDocument[] };

  characterTracks: {
    [characterId: string]: {
      [TrackTypes.Fray]: {
        [key: string]: ProgressTrack;
      };
      [TrackTypes.Journey]: {
        [key: string]: ProgressTrack;
      };
      [TrackTypes.Vow]: {
        [key: string]: ProgressTrack;
      };
      [TrackTypes.DelveSite]: {
        [key: string]: ProgressTrack;
      };
      [TrackTypes.SceneChallenge]: {
        [key: string]: SceneChallenge;
      };
      [TrackTypes.Clock]: {
        [key: string]: Clock;
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
