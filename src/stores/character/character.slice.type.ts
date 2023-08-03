import { Unsubscribe } from "firebase/firestore";
import { StoredAsset } from "types/Asset.type";
import { CharacterDocument, StatsMap } from "types/Character.type";

export interface CharacterSliceData {
  characterMap: { [characterId: string]: CharacterDocument };
  characterPortraitMap: {
    [characterId: string]: { filename: string; url?: string; loading: boolean };
  };
  error?: string;
  loading: boolean;
}

export interface CharacterSliceActions {
  subscribe: (uid?: string) => Unsubscribe | undefined;

  createCharacter: (
    name: string,
    stats: StatsMap,
    assets: [StoredAsset, StoredAsset, StoredAsset]
  ) => Promise<string>;
  deleteCharacter: (characterId: string) => Promise<void>;
  loadCharacterPortrait: (
    uid: string,
    characterId: string,
    filename?: string
  ) => void;
}

export type CharacterSlice = CharacterSliceData & CharacterSliceActions;
