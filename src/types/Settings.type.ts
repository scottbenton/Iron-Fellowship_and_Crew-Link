import { CustomTrack } from "./CustomTrackSettings.type";

export interface OracleAndMoveVisibilitySettings {
  hiddenCustomOraclesIds: string[];
  hiddenCustomMoveIds: string[];
  hideDelveMoves?: boolean;
  hideDelveOracles?: boolean;
}

export interface SettingsDoc extends OracleAndMoveVisibilitySettings {
  customStats: string[];
  customTracks: { [key: string]: CustomTrack };
}
