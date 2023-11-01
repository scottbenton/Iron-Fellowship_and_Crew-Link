import { CharacterDocument } from "types/Character.type";
import { AssetSlice } from "./assets/assets.slice.type";
import { CharacterTracksSlice } from "./tracks/characterTracks.slice.type";

export interface CurrentCharacterSliceData {
  currentCharacterId?: string;
  currentCharacter?: CharacterDocument;
}
export interface CurrentCharacterSliceActions {
  setCurrentCharacterId: (characterId?: string) => void;

  updateCurrentCharacter: (
    character: Partial<CharacterDocument>
  ) => Promise<void>;
  updateCurrentCharacterPortrait: (
    portrait: File | undefined,
    scale: number,
    position: { x: number; y: number }
  ) => Promise<void>;
  removeCurrentCharacterPortrait: () => Promise<void>;

  resetStore: () => void;
}

export type CurrentCharacterSlice = CurrentCharacterSliceData &
  CurrentCharacterSliceActions & {
    assets: AssetSlice;
    tracks: CharacterTracksSlice;
  };
