import { StateCreator } from "zustand";
import { CharacterSlice } from "./character/character.slice.type";
import { AuthSlice } from "./auth/auth.slice.type";
import { CampaignSlice } from "./campaign/campaign.slice.type";
import { UserSlice } from "./user/users.slice.type";
import { WorldSlice } from "./world/world.slice.type";
import { SettingsSlice } from "./settings/settings.slice.type";
import { NotesSlice } from "./notes/notes.slice.type";
import { GameLogSlice } from "./gameLog/gameLog.slice.type";
import { AccessibilitySettingsSlice } from "./accessibilitySettings/accessibilitySettings.slice.type";
import { AppStateSlice } from "./appState/appState.slice.type";
import { HomebrewSlice } from "./homebrew/homebrew.slice.type";
import { RulesSlice } from "./rules/rules.slice.type";

export type IStore = {
  appState: AppStateSlice;
  auth: AuthSlice;
  characters: CharacterSlice;
  campaigns: CampaignSlice;
  users: UserSlice;
  worlds: WorldSlice;
  settings: SettingsSlice;
  notes: NotesSlice;
  gameLog: GameLogSlice;
  accessibilitySettings: AccessibilitySettingsSlice;
  homebrew: HomebrewSlice;
  rules: RulesSlice;
};

export type CreateSliceType<T> = StateCreator<
  IStore,
  [["zustand/immer", never]],
  [],
  T
>;
