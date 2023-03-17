export interface OracleAndMoveVisibilitySettings {
  hiddenCustomOraclesIds: string[];
  hiddenCustomMoveIds: string[];
}

export interface CampaignSettingsDoc extends OracleAndMoveVisibilitySettings {}
export interface CharacterSettingsDoc extends OracleAndMoveVisibilitySettings {}
