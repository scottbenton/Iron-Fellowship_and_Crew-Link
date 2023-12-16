import { Expansion, Ruleset } from "@datasworn/core";

type RuleKeys =
  | "oracles"
  | "moves"
  | "assets"
  | "atlas"
  | "npcs"
  | "truths"
  | "rarities"
  | "delve_sites"
  | "site_themes"
  | "site_domains"
  | "rules";

type additions = {
  uids: string[];
  creatorUid: string;
};

export type BaseExpansion = Omit<Expansion, RuleKeys> & additions;
export type BaseRuleset = Omit<Ruleset, RuleKeys> & additions;

export type BaseExpansionOrRuleset = BaseExpansion | BaseRuleset;

export interface StoredStat {
  label: string;
  description: string;
}

export interface StoredConditionMeter {
  description: string;
  shared: boolean;
  label: string;
  value: number;
  min: number;
  max: number;
  rollable: boolean;
}

export interface StoredImpact {
  label: string;
  description: string;
  contents: {
    [impactKey: string]: {
      label: string;
      description: string;
      shared: boolean;
      // ex: health, spirit
      prevents_recovery: string[];
      permanent: boolean;
    };
  };
}
export interface StoredSpecialTrack {
  label: string;
  description: string;
  shared: boolean;
  optional: boolean;
}

export interface StoredRules {
  stats: {
    [statKey: string]: StoredStat;
  };
  condition_meters: {
    [conditionMeterKey: string]: StoredConditionMeter;
  };
  impacts: {
    [impactCategoryKey: string]: StoredImpact;
  };
  special_tracks: { [specialTrackKey: string]: StoredSpecialTrack };
}
