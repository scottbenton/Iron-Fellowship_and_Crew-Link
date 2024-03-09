export enum LEGACY_TRACK_TYPES {
  QUESTS = "quests",
  BONDS = "bonds",
  DISCOVERIES = "discoveries",
}
export interface LegacyTrack {
  value: number;
  spentExperience?: { [index: number]: boolean };
  isLegacy?: boolean;
}
