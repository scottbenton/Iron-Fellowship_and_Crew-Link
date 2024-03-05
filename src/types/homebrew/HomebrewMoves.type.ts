export interface StoredMoveCategory {
  collectionId: string;
  label: string;
  description?: string;
  enhancesId?: string;
  replacesId?: string;
}

export enum MoveType {
  ActionRoll = "actionRoll",
  NoRoll = "noRoll",
  ProgressRoll = "progressRoll",
  SpecialTrack = "specialTrack",
}

export interface GenericStoredMove {
  collectionId: string;
  categoryId: string;
  label: string;
  text: string;
  oracles?: string[];
  replacesId?: string;
  type: MoveType;
}

export interface StoredMoveNoRoll extends GenericStoredMove {
  type: MoveType.NoRoll;
}
export interface StoredMoveActionRoll extends GenericStoredMove {
  type: MoveType.ActionRoll;
  stats?: string[];
  conditionMeters?: string[];
  assetControls?: string[];
}
export interface StoredMoveProgressRoll extends GenericStoredMove {
  type: MoveType.ProgressRoll;
  category: string;
}
export interface StoredMoveSpecialTrackRoll extends GenericStoredMove {
  type: MoveType.SpecialTrack;
  specialTracks: string[];
}

export type StoredMove =
  | StoredMoveNoRoll
  | StoredMoveActionRoll
  | StoredMoveProgressRoll
  | StoredMoveSpecialTrackRoll;
